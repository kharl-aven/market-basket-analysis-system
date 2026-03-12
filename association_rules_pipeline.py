import pandas as pd
from mlxtend.frequent_patterns import apriori, fpgrowth, association_rules
from mlxtend.preprocessing import TransactionEncoder
import pickle
import warnings
warnings.filterwarnings('ignore')


class AssociationRulesPipeline:
    """
    Pipeline for generating and analyzing association rules with metrics for decision-making.
    Supports confidence, lift, support, conviction, leverage, and custom scoring.
    """
    
    def __init__(self, minsup=None, minconf=None, minlift=None, drift_thresh=0.1):
        """
        Initialize the pipeline.
        
        Args:
            minsup: Minimum support threshold (0-1)
            minconf: Minimum confidence threshold (0-1)
            minlift: Minimum lift threshold (>1)
            drift_thresh: Drift detection threshold for concept drift
        """
        self.minsup = minsup
        self.minconf = minconf
        self.minlift = minlift or 1.0
        self.drift_thresh = drift_thresh
        self.itemsets = None
        self.rules = None
        self.version_history = []
        self.log = []
        self.metrics_config = {
            'confidence_weight': 0.4,
            'lift_weight': 0.3,
            'support_weight': 0.2,
            'conviction_weight': 0.1
        }

    def fit(self, df, method='fp-growth'):
        """
        Fit the pipeline on transaction data.
        
        Args:
            df: DataFrame with 'Items' column containing comma-separated items
            method: 'fp-growth' or 'apriori'
        """
        encoded = self._preprocess(df)
        
        if self.minsup is None:
            self.minsup = self._auto_minsup(encoded)
        
        # Generate frequent itemsets
        if method == 'fp-growth':
            self.itemsets = fpgrowth(encoded, min_support=self.minsup, use_colnames=True)
        else:
            self.itemsets = apriori(encoded, min_support=self.minsup, use_colnames=True)
        
        # Generate association rules
        if len(self.itemsets) > 0:
            self.rules = association_rules(
                self.itemsets, 
                metric="confidence", 
                min_threshold=self.minconf or 0.5
            )
            
            # Filter by lift if specified
            if self.minlift and len(self.rules) > 0:
                self.rules = self.rules[self.rules['lift'] >= self.minlift]
            
            # Calculate additional metrics and scoring
            if len(self.rules) > 0:
                self.rules = self._calculate_metrics(self.rules)
                self.rules = self._score_rules(self.rules)
                self.rules['antecedents'] = self.rules['antecedents'].apply(lambda x: ', '.join(list(x)))
                self.rules['consequents'] = self.rules['consequents'].apply(lambda x: ', '.join(list(x)))
                self.version_history.append(self.rules.copy())
                self.log.append({
                    'iteration': len(self.version_history),
                    'num_rules': len(self.rules),
                    'rules': self.rules
                })
        else:
            print(f"No frequent itemsets found with minsup={self.minsup}")
            self.rules = pd.DataFrame()

    def update(self, new_df):
        """
        Update the pipeline with new data and detect concept drift.
        
        Args:
            new_df: New transaction data
        """
        if self.rules is not None and len(self.rules) > 0:
            prev_rules = self.rules.copy()
            self.fit(new_df)
            
            if len(self.rules) > 0:
                drift = self._detect_drift(prev_rules, self.rules)
                if drift > self.drift_thresh:
                    print(f"Concept Drift detected ({drift:.2%}), rules have significantly changed!")
                    return {'drift_detected': True, 'drift_score': drift}
                else:
                    return {'drift_detected': False, 'drift_score': drift}
        else:
            self.fit(new_df)
            return {'drift_detected': False, 'drift_score': 0}

    def _preprocess(self, df):
        """
        Preprocess transaction data into one-hot encoded format.
        
        Args:
            df: DataFrame with 'Items' column
            
        Returns:
            One-hot encoded DataFrame
        """
        # Ensure there are no empty rows and split by comma
        baskets = df['Items'].dropna().astype(str).apply(lambda x: [item.strip() for item in x.split(',') if item.strip()])
        
        # Use mlxtend's built-in encoder (much faster for 1000+ rows)
        te = TransactionEncoder()
        te_ary = te.fit(baskets).transform(baskets)
        encoded = pd.DataFrame(te_ary, columns=te.columns_)
        return encoded

    def _auto_minsup(self, encoded):
        """
        Automatically select minimum support to generate ~40-50 rules.
        
        Args:
            encoded: One-hot encoded transaction data
            
        Returns:
            Optimal minimum support value
        """
        candidate_sups = [0.005, 0.01, 0.02, 0.03, 0.05, 0.075, 0.1]
        rule_counts = []
        
        for sup in candidate_sups:
            try:
                itemsets = fpgrowth(encoded, min_support=sup, use_colnames=True)
                if len(itemsets) > 0:
                    rules = association_rules(
                        itemsets, 
                        metric="confidence", 
                        min_threshold=self.minconf or 0.5
                    )
                    rule_counts.append((sup, len(rules)))
                else:
                    rule_counts.append((sup, 0))
            except Exception as e:
                rule_counts.append((sup, 0))
        
        if rule_counts:
            best_sup = min(rule_counts, key=lambda x: abs(x[1] - 45))[0]
            print(f"Auto-selected minsup: {best_sup} (estimated {[r[1] for r in rule_counts if r[0]==best_sup][0]} rules)")
            return best_sup
        return 0.05

    def _calculate_metrics(self, rules):
        """
        Calculate additional metrics for decision-making.
        
        Args:
            rules: Association rules DataFrame
            
        Returns:
            Rules DataFrame with additional metrics
        """
        if len(rules) == 0:
            return rules
        
        
        # Certainty Factor: (confidence - P(B)) / (1 - P(B))
        rules['certainty_factor'] = (rules['confidence'] - rules['consequent support']) / (1 - rules['consequent support'])
        rules['certainty_factor'] = rules['certainty_factor'].replace([float('inf'), -float('inf')], 0)
        
        # Rule Coverage: support of antecedent
        rules['antecedent_coverage'] = rules['antecedent support']
        
        # Rule Prevalence: support of consequent
        rules['consequent_prevalence'] = rules['consequent support']
        
        return rules

    def _score_rules(self, rules):
        """
        Calculate composite score using weighted metrics.
        
        Args:
            rules: Association rules DataFrame
            
        Returns:
            Rules sorted by composite score
        """
        if len(rules) == 0:
            return rules
        
        # Normalize metrics to 0-1 range
        conf_norm = rules['confidence']
        lift_norm = (rules['lift'] - rules['lift'].min()) / (rules['lift'].max() - rules['lift'].min() + 1e-10)
        supp_norm = (rules['support'] - rules['support'].min()) / (rules['support'].max() - rules['support'].min() + 1e-10)
        conv_norm = (rules['conviction'] - rules['conviction'].min()) / (rules['conviction'].max() - rules['conviction'].min() + 1e-10)
        
        # Weighted composite score
        rules['score'] = (
            self.metrics_config['confidence_weight'] * conf_norm +
            self.metrics_config['lift_weight'] * lift_norm +
            self.metrics_config['support_weight'] * supp_norm +
            self.metrics_config['conviction_weight'] * conv_norm
        )
        
        return rules.sort_values('score', ascending=False)

    def _detect_drift(self, prev_rules, cur_rules):
        """
        Detect concept drift by comparing rule overlaps.
        
        Args:
            prev_rules: Previous rules
            cur_rules: Current rules
            
        Returns:
            Drift score (0-1)
        """
        if len(prev_rules) == 0 or len(cur_rules) == 0:
            return 0
        
        N = min(10, len(prev_rules), len(cur_rules))
        try:
            prev_top = set(prev_rules.head(N)['antecedents'].apply(frozenset))
            cur_top = set(cur_rules.head(N)['antecedents'].apply(frozenset))
            overlap = len(prev_top & cur_top) / N
            drift = 1 - overlap
            return drift
        except:
            return 0

    def get_high_confidence_rules(self, min_confidence=0.7, limit=10):
        """
        Get rules with high confidence for immediate decisions.
        
        Args:
            min_confidence: Minimum confidence threshold
            limit: Maximum number of rules to return
            
        Returns:
            DataFrame of high-confidence rules
        """
        if self.rules is None or len(self.rules) == 0:
            return pd.DataFrame()
        
        return self.rules[self.rules['confidence'] >= min_confidence][
            ['antecedents', 'consequents', 'support', 'confidence', 'lift', 'score']
        ].head(limit)

    def get_high_lift_rules(self, min_lift=2.0, limit=10):
        """
        Get rules with high lift for strong associations.
        
        Args:
            min_lift: Minimum lift threshold
            limit: Maximum number of rules to return
            
        Returns:
            DataFrame of high-lift rules
        """
        if self.rules is None or len(self.rules) == 0:
            return pd.DataFrame()
        
        return self.rules[self.rules['lift'] >= min_lift][
            ['antecedents', 'consequents', 'support', 'confidence', 'lift', 'score']
        ].head(limit)

    def get_frequent_rules(self, min_support=None, limit=10):
        """
        Get rules with highest support (most frequent).
        
        Args:
            min_support: Minimum support threshold
            limit: Maximum number of rules to return
            
        Returns:
            DataFrame of frequent rules
        """
        if self.rules is None or len(self.rules) == 0:
            return pd.DataFrame()
        
        filtered = self.rules
        if min_support:
            filtered = filtered[filtered['support'] >= min_support]
        
        return filtered.sort_values('support', ascending=False)[
            ['antecedents', 'consequents', 'support', 'confidence', 'lift', 'score']
        ].head(limit)

    def get_rules_for_item(self, item, metric='confidence', limit=5):
        """
        Get rules where item appears in antecedents (if-then recommendations).
        
        Args:
            item: Item to search for
            metric: Metric to sort by ('confidence', 'lift', 'support')
            limit: Maximum number of rules
            
        Returns:
            DataFrame of relevant rules
        """
        if self.rules is None or len(self.rules) == 0:
            return pd.DataFrame()
        
        matching_rules = self.rules[
            self.rules['antecedents'].apply(lambda x: item in x)
        ]
        
        if len(matching_rules) == 0:
            return pd.DataFrame()
        
        return matching_rules.sort_values(metric, ascending=False)[
            ['antecedents', 'consequents', 'support', 'confidence', 'lift', 'leverage', 'conviction']
        ].head(limit)

    def get_metrics_summary(self):
        """
        Get summary statistics of all metrics.
        
        Returns:
            Dictionary with metric statistics
        """
        if self.rules is None or len(self.rules) == 0:
            return {}
        
        return {
            'total_rules': len(self.rules),
            'support': {
                'mean': self.rules['support'].mean(),
                'min': self.rules['support'].min(),
                'max': self.rules['support'].max()
            },
            'confidence': {
                'mean': self.rules['confidence'].mean(),
                'min': self.rules['confidence'].min(),
                'max': self.rules['confidence'].max()
            },
            'lift': {
                'mean': self.rules['lift'].mean(),
                'min': self.rules['lift'].min(),
                'max': self.rules['lift'].max()
            },
            'leverage': {
                'mean': self.rules['leverage'].mean(),
                'min': self.rules['leverage'].min(),
                'max': self.rules['leverage'].max()
            },
            'conviction': {
                'mean': self.rules['conviction'].mean(),
                'min': self.rules['conviction'].min(),
                'max': self.rules['conviction'].max()
            }
        }

    def save_model(self, filepath):
        """Save pipeline to file."""
        with open(filepath, 'wb') as f:
            pickle.dump(self, f)
        print(f"Model saved to {filepath}")

    @staticmethod
    def load_model(filepath):
        """Load pipeline from file."""
        with open(filepath, 'rb') as f:
            return pickle.load(f)


# Example usage:
if __name__ == "__main__":
    # Sample data
    sample_data = pd.DataFrame({
        'Items': [
            'bread, milk, butter',
            'bread, milk, eggs',
            'bread, butter, eggs',
            'milk, butter, cheese',
            'bread, milk, cheese',
            'butter, eggs, cheese',
            'bread, milk, butter, eggs',
            'milk, cheese, yogurt',
            'bread, butter, yogurt',
            'eggs, cheese, yogurt'
        ]
    })
    
    # Initialize and fit pipeline
    pipeline = AssociationRulesPipeline(minconf=0.5)
    pipeline.fit(sample_data)
    
    # Get various rule sets
    print("=== High Confidence Rules ===")
    print(pipeline.get_high_confidence_rules(min_confidence=0.6))
    
    print("\n=== High Lift Rules ===")
    print(pipeline.get_high_lift_rules(min_lift=1.5))
    
    print("\n=== Rules for 'bread' ===")
    print(pipeline.get_rules_for_item('bread'))
    
    print("\n=== Metrics Summary ===")
    metrics = pipeline.get_metrics_summary()
    for metric, stats in metrics.items():
        if isinstance(stats, dict):
            print(f"{metric}: mean={stats.get('mean', 0):.3f}, "
                  f"min={stats.get('min', 0):.3f}, max={stats.get('max', 0):.3f}")
        else:
            print(f"{metric}: {stats}")

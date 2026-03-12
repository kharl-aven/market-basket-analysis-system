from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from association_rules_pipeline import AssociationRulesPipeline
import io
import traceback
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

pipeline = AssociationRulesPipeline(minconf=0.5)

IMAGE_DIR = os.path.join(os.path.dirname(__file__), 'public', 'images')
valid_images = [f for f in os.listdir(IMAGE_DIR) if f.endswith('.png')] if os.path.exists(IMAGE_DIR) else []

def get_image_path(items_str):
    first_item = items_str.split(',')[0].strip()
    img_name = f"{first_item}.png"
    if img_name in valid_images:
        return f"/images/{img_name}"
    # Make a lowercase comparison just in case
    for img in valid_images:
        if img.lower().startswith(first_item.lower()):
            return f"/images/{img}"
    return "/images/Poke Ball Dessert Bowl.png"

@app.route('/api/reset', methods=['POST'])
def reset_pipeline():
    global pipeline
    pipeline = AssociationRulesPipeline(minconf=0.5)
    return jsonify({'success': True, 'message': 'Pipeline reset'})

@app.route('/api/rules', methods=['GET'])
def get_all_rules():
    if pipeline.rules is None or len(pipeline.rules) == 0:
        return jsonify({'rules': []})
    all_rules = []
    for idx, row in pipeline.rules.iterrows():
        all_rules.append({
            'id': f"rule_{idx}",
            'antecedent': {'name': row['antecedents'], 'image': get_image_path(row['antecedents'])},
            'consequent': {'name': row['consequents'], 'image': get_image_path(row['consequents'])},
            'support': f"{row['support']:.3f}",
            'confidence': f"{row['confidence']:.3f}",
            'lift': float(row['lift']),
            'leverage': float(row.get('leverage', 0)),
            'conviction': float(row.get('conviction', 1.0)),
            'trend': 'up' if float(row['lift']) > 2.0 else 'down'
        })
    return jsonify({'rules': all_rules})

@app.route('/api/insights', methods=['GET'])
def get_insights():
    """Generate all 7 business intelligence outputs from pipeline data."""
    if pipeline.rules is None or len(pipeline.rules) == 0:
        return jsonify({'insights': {}})
    
    rules_df = pipeline.rules.copy()
    itemsets_df = pipeline.itemsets.copy() if pipeline.itemsets is not None else None
    
    insights = {}
    
    # 1. Top Bundles (frequent itemsets) with explanation
    bundles = []
    if itemsets_df is not None and len(itemsets_df) > 0:
        top_itemsets = itemsets_df.sort_values('support', ascending=False).head(5)
        for _, row in top_itemsets.iterrows():
            items = list(row['itemsets'])
            if len(items) >= 2:
                bundles.append({
                    'items': items,
                    'support': f"{row['support']:.3f}",
                    'support_pct': f"{row['support'] * 100:.1f}%",
                    'image': get_image_path(items[0]),
                    'explanation': f"{', '.join(items[:2])}{'...' if len(items) > 2 else ''} appear together in {row['support'] * 100:.1f}% of all transactions. This is a natural bundle."
                })
    insights['top_bundles'] = bundles
    
    # 2. Top Association Rules with full measures
    top_rules = []
    sorted_rules = rules_df.sort_values('lift', ascending=False).head(5)
    for _, row in sorted_rules.iterrows():
        top_rules.append({
            'antecedent': row['antecedents'],
            'consequent': row['consequents'],
            'support': f"{row['support']:.3f}",
            'confidence': f"{row['confidence']:.3f}",
            'lift': f"{row['lift']:.2f}",
            'leverage': f"{row.get('leverage', 0):.4f}",
            'conviction': f"{row.get('conviction', 1.0):.2f}",
            'image': get_image_path(row['antecedents'])
        })
    insights['top_rules'] = top_rules
    
    # 3. Homepage Ranking Logic (e-commerce style: what users see first)
    homepage_items = []
    item_scores = {}
    for _, row in rules_df.iterrows():
        for item in row['antecedents'].split(','):
            item = item.strip()
            score = float(row['support']) * 0.4 + float(row['confidence']) * 0.3 + float(row['lift']) * 0.005
            item_scores[item] = item_scores.get(item, 0) + score
        for item in row['consequents'].split(','):
            item = item.strip()
            score = float(row['support']) * 0.3 + float(row['confidence']) * 0.4 + float(row['lift']) * 0.005
            item_scores[item] = item_scores.get(item, 0) + score
    sorted_items = sorted(item_scores.items(), key=lambda x: x[1], reverse=True)[:6]
    for rank, (item, score) in enumerate(sorted_items, 1):
        homepage_items.append({
            'rank': rank,
            'item': item,
            'score': f"{score:.3f}",
            'image': get_image_path(item),
            'reason': f"High frequency in rules ({score:.2f} composite score). Place prominently on homepage."
        })
    insights['homepage_ranking'] = homepage_items
    
    # 4. "Frequently Bought Together" widget simulation
    fbt = []
    high_conf = rules_df.sort_values('confidence', ascending=False).head(4)
    for _, row in high_conf.iterrows():
        fbt.append({
            'trigger_item': row['antecedents'].split(',')[0].strip(),
            'trigger_image': get_image_path(row['antecedents']),
            'suggested_item': row['consequents'].split(',')[0].strip(),
            'suggested_image': get_image_path(row['consequents']),
            'confidence': f"{row['confidence']:.1%}",
            'label': f"{row['confidence'] * 100:.0f}% of customers also bought this"
        })
    insights['frequently_bought_together'] = fbt
    
    # 5. Cross-sell suggestions (when an item is added to cart)
    crosssell = []
    unique_antecedents = rules_df['antecedents'].unique()[:4]
    for ant in unique_antecedents:
        matching = rules_df[rules_df['antecedents'] == ant].sort_values('lift', ascending=False).head(3)
        suggestions = []
        for _, row in matching.iterrows():
            suggestions.append({
                'item': row['consequents'],
                'image': get_image_path(row['consequents']),
                'confidence': f"{row['confidence']:.1%}",
                'lift': f"{row['lift']:.2f}"
            })
        if suggestions:
            crosssell.append({
                'cart_item': ant.split(',')[0].strip(),
                'cart_image': get_image_path(ant),
                'suggestions': suggestions
            })
    insights['cross_sell'] = crosssell
    
    # 6. Promo Recommendation Generator
    promos = []
    promo_rules = rules_df.sort_values('lift', ascending=False).head(5)
    promo_types = [
        ('Bundle Discount', '15% off when bought together', 'bundle'),
        ('Buy 2 Get 1', 'Add {cons} free with {ant}', 'b2g1'),
        ('Combo Meal', 'Special combo price for this pair', 'combo'),
        ('Happy Hour Deal', '20% off this pairing during 3-5 PM', 'happy_hour'),
        ('Loyalty Reward', 'Double points when ordering together', 'loyalty')
    ]
    for i, (_, row) in enumerate(promo_rules.iterrows()):
        ptype = promo_types[i % len(promo_types)]
        ant_name = row['antecedents'].split(',')[0].strip()
        cons_name = row['consequents'].split(',')[0].strip()
        desc = ptype[1].replace('{ant}', ant_name).replace('{cons}', cons_name)
        promos.append({
            'type': ptype[2],
            'title': ptype[0],
            'description': f"{desc}: {ant_name} + {cons_name}",
            'lift': f"{row['lift']:.2f}",
            'confidence': f"{row['confidence']:.1%}",
            'image': get_image_path(row['antecedents']),
            'est_impact': f"+{int(row['lift'] * 4)}% revenue"
        })
    insights['promo_recommendations'] = promos
    
    # 7. Business Insights (shelf/menu placement suggestions)
    placements = []
    leverage_sorted = rules_df.sort_values('leverage', ascending=False).head(4)
    for _, row in leverage_sorted.iterrows():
        ant_name = row['antecedents'].split(',')[0].strip()
        cons_name = row['consequents'].split(',')[0].strip()
        lev = float(row.get('leverage', 0))
        lift_val = float(row['lift'])
        if lift_val > 3:
            strength = "Very Strong"
            action = f"Place {cons_name} directly next to {ant_name} on the menu. Create a visible 'Perfect Pair' callout."
        elif lift_val > 2:
            strength = "Strong"
            action = f"Position {cons_name} in the same menu section as {ant_name}. Highlight as a recommended add-on."
        else:
            strength = "Moderate"
            action = f"Include {cons_name} as a suggestion in the order flow after {ant_name} is selected."
        placements.append({
            'antecedent': ant_name,
            'consequent': cons_name,
            'leverage': f"{lev:.4f}",
            'lift': f"{lift_val:.2f}",
            'strength': strength,
            'suggestion': action,
            'ant_image': get_image_path(row['antecedents']),
            'cons_image': get_image_path(row['consequents'])
        })
    insights['shelf_placement'] = placements
    
    return jsonify({'insights': insights})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Read the CSV from the uploaded file buffer
        df = pd.read_csv(io.StringIO(file.stream.read().decode("UTF8"), newline=None))
        
        # Check if we should fit or update based on whether rules already exist
        if pipeline.rules is None or len(pipeline.rules) == 0:
            pipeline.fit(df, method='fp-growth')
            drift_results = {'drift_detected': False, 'drift_score': 0}
        else:
            drift_results = pipeline.update(df)
            
        high_lift_rules = pipeline.get_high_lift_rules(min_lift=1.5, limit=5)
        
        # Format rules for the frontend
        rules_list = []
        if not high_lift_rules.empty:
            for idx, row in high_lift_rules.iterrows():
                rules_list.append({
                    'id': f"rule_{idx}",
                    'antecedent': {'name': row['antecedents'], 'image': get_image_path(row['antecedents'])},
                    'consequent': {'name': row['consequents'], 'image': get_image_path(row['consequents'])},
                    'support': f"{row['support']:.3f}",
                    'confidence': f"{row['confidence']:.3f}",
                    'lift': float(row['lift']),
                    'leverage': float(row.get('leverage', row.get('support', 0) - (row.get('antecedent support', 0) * row.get('consequent support', 0)))), # calculate if missing
                    'conviction': float(row.get('conviction', 1.0)),
                    'trend': 'up' if float(row['lift']) > 2.0 else 'down'
                })
                
        # Generate some recommendations based on the top rules
        recommendations = []
        if len(rules_list) > 0:
            top_rule = rules_list[0]
            recommendations.append({
                'id': "1",
                'type': "promo",
                'title': "Promo Generator",
                'description': f"High lift detected. Suggest 15% off {top_rule['antecedent']['name']} & {top_rule['consequent']['name']} Combo.",
                'impact': f"Est. +{int(top_rule['lift'] * 5)}% revenue",
                'image': top_rule['antecedent']['image']
            })
            if len(rules_list) > 1:
                second_rule = rules_list[1]
                recommendations.append({
                    'id': "2",
                    'type': "placement",
                    'title': "Menu Placement",
                    'description': f"Move {second_rule['consequent']['name']} next to {second_rule['antecedent']['name']} on the Evening Menu.",
                    'impact': f"Est. +{int(float(second_rule['confidence']) * 15)}% cross-sell",
                    'image': second_rule['consequent']['image']
                })
            if len(rules_list) > 2:
                third_rule = rules_list[2]
                recommendations.append({
                    'id': "3",
                    'type': "promo",
                    'title': "Combo Deal",
                    'description': f"Create a new Combo Deal: {third_rule['antecedent']['name']} + {third_rule['consequent']['name']}.",
                    'impact': f"Est. +{int(float(third_rule['confidence']) * 20)}% margin",
                    'image': third_rule['antecedent']['image']
                })
        
        return jsonify({
            'success': True,
            'rules': rules_list,
            'drift': drift_results,
            'iteration': len(pipeline.version_history),
            'recommendations': recommendations
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

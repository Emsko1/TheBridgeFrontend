import xml.etree.ElementTree as ET
import re

svg_path = r'c:\Users\HP\Desktop\TheBridgeFrontend\frontend\public\Bridgelogo.svg'
output_path = r'c:\Users\HP\Desktop\TheBridgeFrontend\frontend\public\Bridgelogo_processed.svg'

# Register namespaces to prevent ns0: prefixes
ET.register_namespace('', "http://www.w3.org/2000/svg")

try:
    tree = ET.parse(svg_path)
    root = tree.getroot()
    
    # 1. Remove the background path
    # It identifies as the one with fill="#FEFEFE" or very large bounding box
    # From inspection, it's the first path with fill="#FEFEFE"
    
    paths_to_remove = []
    
    for child in root:
        if 'path' in child.tag:
            fill = child.get('fill')
            if fill and fill.upper() in ['#FEFEFE', '#FFFFFF', '#FFF']:
                paths_to_remove.append(child)
    
    for p in paths_to_remove:
        root.remove(p)
        print("Removed background path")

    # 2. Make paths bolder
    # Add stroke and stroke-width to remaining paths
    # We use the fill color as the stroke color to thicken the shape
    
    for child in root:
        if 'path' in child.tag:
            fill = child.get('fill')
            if fill:
                # Add stroke matching the fill
                child.set('stroke', fill)
                # Set stroke width - adjusting based on viewBox 921x384
                # Try 2px first
                child.set('stroke-width', '3')
    
    tree.write(output_path, encoding='UTF-8', xml_declaration=True)
    print(f"Successfully processed logo to {output_path}")

except Exception as e:
    print(f"Error processing SVG: {e}")

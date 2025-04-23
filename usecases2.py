import xml.etree.ElementTree as ET
import json

# Load and parse the XML file
file_path = '/Users/princiya/Desktop/knowledge-portal/new.xml'
tree = ET.parse(file_path)
root = tree.getroot()

# Define the namespaces used in the XML
namespaces = {
    '': 'http://www.opengroup.org/xsd/archimate/3.0/',  # Default namespace
    'xsi': 'http://www.w3.org/2001/XMLSchema-instance'   # Add the xsi namespace
}

# Function to extract diagrams related to use cases and their elements
def extract_use_case_diagrams_with_elements(root):
    use_case_diagrams = []
    
    # Iterate through all the view elements to find those of type 'Diagram'
    for view in root.findall('.//view[@xsi:type="Diagram"]', namespaces):
        identifier = view.attrib.get('identifier')
        name = view.find('name', namespaces).text if view.find('name', namespaces) is not None else ""
        
        # Extract elementRef from each node inside the view
        element_refs = []
        for node in view.findall('.//node', namespaces):
            element_ref = node.attrib.get('elementRef')
            if element_ref:
                element_refs.append(element_ref)
        
        # Gather element details for each elementRef
        elements = []
        for ref in element_refs:
            element = root.find(f'.//element[@identifier="{ref}"]', namespaces)
            if element is not None:
                element_name = element.find('name', namespaces).text if element.find('name', namespaces) is not None else ""
                element_type = element.attrib.get('{http://www.w3.org/2001/XMLSchema-instance}type')
                
                # Add element details to the list
                elements.append({
                    "name": element_name,
                    "type": element_type
                })
        
        # Add the use case diagram with its elements
        use_case_diagram = {
            "identifier": identifier,
            "name": name,
            "elements": elements  # List of elements related to the use case
        }
        
        use_case_diagrams.append(use_case_diagram)
    
    return use_case_diagrams

# Extract use case diagrams and their associated elements
use_case_diagrams = extract_use_case_diagrams_with_elements(root)

# Sort the JSON array based on 'name'
use_case_diagrams.sort(key=lambda x: x['name'])

# Convert the result into a JSON formatted string, ensuring non-ASCII characters are handled properly
use_case_diagrams_json = json.dumps(use_case_diagrams, indent=2, ensure_ascii=False)

# Write the JSON to a file
output_file_path = '/Users/princiya/Desktop/knowledge-portal/use_case_diagrams_with_elements.json'
with open(output_file_path, 'w', encoding='utf-8') as json_file:
    json_file.write(use_case_diagrams_json)

print(f"Use case diagrams with elements have been written to {output_file_path}")

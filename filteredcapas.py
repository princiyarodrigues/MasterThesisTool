import json
import xmltodict

def extract_flow_relationships(file_path):
    # Read the XML file
    with open(file_path, 'r', encoding='utf-8') as f:
        xml_content = f.read()

    # Parse XML into a Python dictionary
    parsed_xml = xmltodict.parse(xml_content)

    # Adjust the following keys if your XML structure differs.
    # Here we assume relationships are stored at:
    # parsed_xml['model']['relationships']['relationship']
    relationships = parsed_xml['model']['relationships']['relationship']

    # Filter only those relationships with xsi:type equal to "Flow"
    flow_relationships = [rel for rel in relationships if rel.get('@xsi:type') == "Flow"]

    # Write the filtered relationships to a JSON file
    output_file = "flow_relationships.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(flow_relationships, f, indent=2, ensure_ascii=False)

    print(f"Extracted {len(flow_relationships)} Flow relationship(s) saved to {output_file}")

if __name__ == '__main__':
    # Update the file path as needed.
    extract_flow_relationships('/Users/princiya/Desktop/knowledge-portal/outputCapas.xml')

#!/usr/bin/env python3
"""
Create usecase_views_and_relations.json
  • 34 “Use Case …” elements           (name-based)
  • every view that shows them         (recursive elementRef search)
  • every Access / Aggregation / Flow  relationship that touches a use-case
Works on Python 3.7 +
"""

import json, os
from collections import defaultdict
from pathlib import Path
from typing import Optional, Dict, Any, List

import xmltodict
from lxml import etree

# ──────────────────────────────────  paths
SOURCE_XML = Path("/Users/princiya/Desktop/knowledge-portal/new.xml")
OUT_JSON   = Path("usecase_views_and_relations.json")

# ──────────────────────────────────  helpers
def get_name(el: Dict[str, Any]) -> Optional[str]:
    if isinstance(el.get("@name"), str):
        return el["@name"]
    nm = el.get("name")
    if isinstance(nm, str):
        return nm
    if isinstance(nm, dict):
        return nm.get("#text") or nm.get("value") or nm.get("_")
    if isinstance(nm, list) and nm and isinstance(nm[0], dict):
        first = nm[0]
        return first.get("#text") or first.get("value") or first.get("_")
    return None


def listify(obj):
    return obj if isinstance(obj, list) else ([] if obj is None else [obj])


# recursive walk to collect every @elementRef in a view dict
def all_element_refs(tree: Any) -> List[str]:
    refs = []
    if isinstance(tree, dict):
        if "@elementRef" in tree:
            refs.append(tree["@elementRef"])
        for v in tree.values():
            refs.extend(all_element_refs(v))
    elif isinstance(tree, list):
        for item in tree:
            refs.extend(all_element_refs(item))
    return refs


# ──────────────────────────────────  main
def main() -> None:
    # tolerant XML parse (lxml recovers broken & etc.)
    parser = etree.XMLParser(recover=True)
    xml_root = etree.parse(str(SOURCE_XML), parser)
    model = xmltodict.parse(etree.tostring(xml_root, encoding="utf-8"))

    elements      = listify(model["model"]["elements"]["element"])
    relationships = listify(model["model"]["relationships"]["relationship"])
    views         = listify(model["model"].get("views", {}).get("view"))

    el_by_id = {el["@identifier"]: el for el in elements}

    # ── identify use-cases ---------------------------------------------------
    usecases, usecase_ids = [], set()
    for el in elements:
        name = get_name(el) or ""
        if name.startswith("Use Case "):
            usecases.append({"identifier": el["@identifier"], "name": name})
            usecase_ids.add(el["@identifier"])

    print("Use-cases found:", len(usecases))

    # ── which views show them?  (deep elementRef search) --------------------
    views_for_uc: Dict[str, list] = defaultdict(list)
    for vw in views:
        v_id   = vw["@identifier"]
        v_name = get_name(vw) or "(unnamed diagram)"
        for ref in all_element_refs(vw):
            if ref in usecase_ids:
                views_for_uc[ref].append({"identifier": v_id, "name": v_name})

    for uc in usecases:
        uc["views"] = views_for_uc.get(uc["identifier"], [])

    # ── relationships --------------------------------------------------------
    rel_map = {"access": [], "aggregation": [], "flow": []}
    for rel in relationships:
        rtype = rel.get("@xsi:type", "")
        key = None
        if "Access" in rtype:
            key = "access"
        elif "Aggregation" in rtype:
            key = "aggregation"
        elif "Flow" in rtype:
            key = "flow"
        if key:
            src, tgt = rel.get("@source"), rel.get("@target")
            if src in usecase_ids or tgt in usecase_ids:
                rel_map[key].append({
                    "identifier": rel["@identifier"],
                    "type": rtype,
                    "source_id": src,
                    "source_name": get_name(el_by_id.get(src, {})),
                    "target_id": tgt,
                    "target_name": get_name(el_by_id.get(tgt, {}))
                })

    # ── output --------------------------------------------------------------
    OUT_JSON.write_text(
        json.dumps({"usecases": usecases, "relationships": rel_map},
                   indent=2, ensure_ascii=False),
        encoding="utf-8"
    )
    print("JSON written:", OUT_JSON.resolve())


# ──────────────────────────────────  entry
if __name__ == "__main__":
    print("CWD:", os.getcwd())
    main()

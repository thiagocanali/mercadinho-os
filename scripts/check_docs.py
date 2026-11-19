#!/usr/bin/env python3
"""Validate the Mercadinho OS documentation structure and relative links."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
ROOT_FILES = ["AGENTS.md", "README.md", "CODEX-WORKFLOW.md", "PROJECT-CONTEXT.md"]
DOC_FILES = [
    "docs/" + name for name in [
        "01-VISAO-DO-PRODUTO.md", "02-REQUISITOS.md", "03-ARQUITETURA.md",
        "04-MODELO-DE-DADOS.md", "05-ROADMAP.md", "06-REGRAS-DE-NEGOCIO.md",
        "07-SEGURANCA-E-LGPD.md", "08-INFRAESTRUTURA-E-CUSTOS.md",
        "09-DECISOES-TECNICAS.md", "10-STATUS-DO-PROJETO.md",
        "11-PLANO-DE-TESTES.md", "12-OPERACAO-E-IMPLANTACAO.md",
        "13-FLUXOS-OPERACIONAIS.md", "14-UX-UI-DESIGN-SYSTEM.md",
        "15-CONTROLES-E-AUDITORIA.md", "16-BACKUP-E-DISASTER-RECOVERY.md",
        "17-INTEGRACOES.md", "18-ESTRATEGIA-COMERCIAL.md"
    ]
]
LINK = re.compile(r"(?<!!)\[[^\]]+\]\(([^)]+)\)")
BARE_MD = re.compile(r"(?<![\w/])(?:docs/)?(?:\d{2}-[A-Z0-9-]+|AGENTS|README|CODEX-WORKFLOW|PROJECT-CONTEXT)\.md")

def main():
    errors = []
    expected = ROOT_FILES + DOC_FILES
    for name in expected:
        if not (ROOT / name).is_file():
            errors.append(f"Missing required file: {name}")
    for name in expected:
        file = ROOT / name
        if not file.is_file():
            continue
        content = file.read_text(encoding="utf-8")
        if not content.strip() or not content.lstrip().startswith("#"):
            errors.append(f"{name}: missing Markdown title/content")
        for dest in LINK.findall(content):
            if dest.startswith(("https://", "http://", "mailto:", "#")):
                continue
            target = (file.parent / dest.split("#", 1)[0]).resolve()
            if not target.is_relative_to(ROOT.resolve()) or not target.is_file():
                errors.append(f"{name}: broken relative link: {dest}")
        for match in BARE_MD.finditer(content):
            dest = match.group(0)
            if "/" in dest:
                target = ROOT / dest
            elif name.startswith("docs/") and dest[0:2].isdigit():
                target = file.parent / dest
            else:
                target = ROOT / dest
            if not target.is_file():
                errors.append(f"{name}: missing referenced document: {dest}")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"OK: {len(expected)} required Markdown files and document references verified")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

"""Regression tests for documentation validation (stdlib only)."""
import contextlib
import importlib.util
import io
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

MODULE = Path(__file__).resolve().parents[1] / "scripts" / "check_docs.py"
spec = importlib.util.spec_from_file_location("check_docs", MODULE)
check_docs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check_docs)


class DocumentationValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.old_root = check_docs.ROOT
        self.addCleanup(setattr, check_docs, "ROOT", self.old_root)
        check_docs.ROOT = Path(self.temp.name)
        for path in check_docs.ROOT_FILES + check_docs.DOC_FILES:
            target = check_docs.ROOT / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text("# Valid document\n", encoding="utf-8")

    def run_check(self):
        with contextlib.redirect_stderr(io.StringIO()) as err:
            with contextlib.redirect_stdout(io.StringIO()) as out:
                result = check_docs.main()
        return result, out.getvalue(), err.getvalue()

    def test_complete_documentation_passes(self):
        code, output, errors = self.run_check()
        self.assertEqual(code, 0, errors)
        self.assertIn("22 required Markdown files", output)

    def test_missing_required_file_fails(self):
        (check_docs.ROOT / "AGENTS.md").unlink()
        code, _, errors = self.run_check()
        self.assertEqual(code, 1)
        self.assertIn("Missing required file: AGENTS.md", errors)

    def test_broken_markdown_link_fails(self):
        (check_docs.ROOT / "README.md").write_text(
            "# Readme\n[Broken](docs/99-UNKNOWN.md)\n", encoding="utf-8"
        )
        code, _, errors = self.run_check()
        self.assertEqual(code, 1)
        self.assertIn("broken relative link", errors)

    def test_missing_reference_in_code_span_fails(self):
        (check_docs.ROOT / "README.md").write_text(
            "# Readme\nSee `docs/99-UNKNOWN.md`.\n", encoding="utf-8"
        )
        code, _, errors = self.run_check()
        self.assertEqual(code, 1)
        self.assertIn("missing referenced document", errors)


if __name__ == "__main__":
    unittest.main()

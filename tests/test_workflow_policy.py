"""Guardrails for the repository's protected autonomous CI policy."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / ".github/workflows/docs.yml"
AGENTS = ROOT / "AGENTS.md"


class WorkflowPolicyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.workflow = WORKFLOW.read_text(encoding="utf-8")
        cls.agents = AGENTS.read_text(encoding="utf-8")

    def test_pr_checks_are_not_path_filtered(self):
        triggers = self.workflow.split("\nconcurrency:", 1)[0]
        self.assertRegex(triggers, r"(?m)^  pull_request:\s*$")
        self.assertNotRegex(triggers, r"(?m)^\s+paths(?:-ignore)?:\s*$")

    def test_main_is_only_push_target(self):
        self.assertRegex(self.workflow, r"(?m)^    branches: \[main\]\s*$")
        self.assertIn("workflow_dispatch:", self.workflow)

    def test_old_pr_runs_are_cancelled_but_main_is_not(self):
        self.assertIn("github.event.pull_request.number || github.ref", self.workflow)
        self.assertIn("cancel-in-progress: ${{ github.event_name == 'pull_request' }}", self.workflow)

    def test_ci_has_minimum_permissions(self):
        self.assertRegex(self.workflow, r"(?m)^permissions:\n  contents: read\s*$")
        self.assertNotRegex(self.workflow, r"(?m)^\s+(?:actions|pull-requests|checks): write\s*$")

    def test_validation_jobs_and_security_suite_exist(self):
        for fragment in (
            "  validate:", "  postgres-smoke:", "npm test",
            "npm run typecheck", "npm run build", "postgres:16",
            "tests/postgres_rls.sql", "tests/postgres_restricted_role.sql",
            "tests/postgres_concurrency.sh",
        ):
            with self.subTest(fragment=fragment):
                self.assertIn(fragment, self.workflow)

    def test_ci_does_not_use_mutable_action_references(self):
        import re
        references = re.findall(r'(?m)^\s*- uses:\s*(\S+)', self.workflow)
        self.assertTrue(references, 'CI must declare checkout and setup actions')
        for reference in references:
            with self.subTest(action=reference):
                self.assertRegex(reference, r'^[\w.-]+/[\w.-]+@(?:[a-f0-9]{40}|v\d+(?:\.\d+){0,2})
        forbidden = (
            "vercel deploy", "wrangler deploy", "deployments: write",
            "id-token: write", "secrets.", "NEON_DATABASE_URL",
        )
        for fragment in forbidden:
            with self.subTest(fragment=fragment):
                self.assertNotIn(fragment, self.workflow)

    def test_workflow_has_bounded_jobs(self):
        self.assertGreaterEqual(self.workflow.count("timeout-minutes: 15"), 2)

    def test_agents_require_pr_reuse_and_no_bypass(self):
        for phrase in (
            "5 a 10 tarefas", "PR existente", "Nunca desabilitar",
            "revisões obrigatórias", "rascunhos",
        ):
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, self.agents)


if __name__ == "__main__":
    unittest.main()
)

    def test_ci_does_not_deploy_or_request_secrets(self):
        forbidden = (
            "vercel deploy", "wrangler deploy", "deployments: write",
            "id-token: write", "secrets.", "NEON_DATABASE_URL",
        )
        for fragment in forbidden:
            with self.subTest(fragment=fragment):
                self.assertNotIn(fragment, self.workflow)

    def test_workflow_has_bounded_jobs(self):
        self.assertGreaterEqual(self.workflow.count("timeout-minutes: 15"), 2)

    def test_agents_require_pr_reuse_and_no_bypass(self):
        for phrase in (
            "5 a 10 tarefas", "PR existente", "Nunca desabilitar",
            "revisões obrigatórias", "rascunhos",
        ):
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, self.agents)


if __name__ == "__main__":
    unittest.main()

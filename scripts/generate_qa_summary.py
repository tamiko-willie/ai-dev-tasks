
"""Utility for creating a markdown QA summary file for compliance audits."""


import argparse
import re
from pathlib import Path


def parse_tasks(path: Path):

    """Parse a markdown task list.

    Parameters
    ----------
    path : Path
        Path to the markdown file containing a ``## Tasks`` section.

    Returns
    -------
    list[str]
        Formatted task strings preserving completion status.
    """

    tasks = []
    if not path or not path.is_file():
        return tasks
    in_tasks = False
    pattern = re.compile(r"^\s*- \[( |x)\] \d+\.\d+ (.+)")
    with path.open() as f:
        for line in f:
            lower = line.strip().lower()
            if lower.startswith("## tasks"):
                in_tasks = True
                continue
            if in_tasks:
                if line.strip().startswith("##") and not lower.startswith("## tasks"):
                    break
                m = pattern.match(line)
                if m:
                    status = "Done" if m.group(1) == "x" else "Todo"
                    tasks.append(f"[{status}] {m.group(2).strip()}")
    return tasks


def read_text(path: Path):

    if path and path.is_file():
        return path.read_text().strip()
    return ""


def generate_summary(args):
main
    tasks = parse_tasks(args.tasks_file) if args.tasks_file else []
    coverage = read_text(args.test_coverage)
    bugs = read_text(args.bugs_fixed)

    lines = ["# QA Summary", ""]

    if tasks:
        lines.append("## Task Names")
        for t in tasks:
            lines.append(f"- {t}")
        lines.append("")

    if args.qa_reviewers:
        lines.append("## QA Reviewer(s)")
        for name in args.qa_reviewers.split(','):
            lines.append(f"- {name.strip()}")
        lines.append("")

    if coverage:
        lines.append("## Test Coverage Results")
        lines.append(coverage)
        lines.append("")

    if bugs:
        lines.append("## Bugs Found / Fixed")
        lines.append(bugs)
        lines.append("")

    if args.cicd_log_url:
        lines.append("## CI/CD Logs")
        lines.append(args.cicd_log_url)
        lines.append("")


    Path(args.output).write_text("\n".join(lines))
 main


def main():
    parser = argparse.ArgumentParser(description="Generate qa-summary.md for compliance audits")
    parser.add_argument("--tasks-file", type=Path, help="Path to tasks markdown file")
    parser.add_argument("--qa-reviewers", help="Comma-separated list of QA reviewer names")
    parser.add_argument("--test-coverage", type=Path, help="Path to test coverage results file")
    parser.add_argument("--bugs-fixed", type=Path, help="Path to bugs found/fixed file")
    parser.add_argument("--cicd-log-url", help="Link to CI/CD logs")
    parser.add_argument("--output", default="qa-summary.md", help="Output markdown file")
 main
    args = parser.parse_args()
    generate_summary(args)


if __name__ == "__main__":
    main()

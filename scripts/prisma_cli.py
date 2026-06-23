import os
import subprocess
import sys
from pathlib import Path


def main() -> int:
    project_root = Path(__file__).resolve().parent.parent
    scripts_dir = project_root / ".venv" / "Scripts"
    os.environ["PATH"] = f"{scripts_dir}{os.pathsep}{os.environ.get('PATH', '')}"

    return subprocess.call(
        [sys.executable, "-m", "prisma", *sys.argv[1:]],
        cwd=project_root,
        env=os.environ,
    )


if __name__ == "__main__":
    raise SystemExit(main())

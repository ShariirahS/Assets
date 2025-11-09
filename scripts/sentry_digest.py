#!/usr/bin/env python3
"""Placeholder for Sentry digest generation."""

import json

# TODO: Implement Sentry API integration once credentials are provisioned.
# This script should query Sentry issues and format a summary for Slack.

def main() -> None:
    payload = {
        "text": "Sentry digest not yet implemented",
        "attachments": [
            {
                "title": "Sentry",
                "text": "Connect Sentry API to populate this digest.",
            }
        ],
    }
    print(json.dumps(payload))


if __name__ == "__main__":
    main()

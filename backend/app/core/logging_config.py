import logging
import json
import sys
import os
from datetime import datetime
from typing import Any, Dict
from logging.handlers import TimedRotatingFileHandler

class TraceFormatter(logging.Formatter):
    """Custom formatter to output JSON for reasoning traces (Console)."""
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.fromtimestamp(record.created).isoformat(),
            "level": record.levelname,
            "module": record.module,
            "message": record.getMessage(),
        }
        if hasattr(record, "trace_data"):
            log_data["trace"] = record.trace_data
            
        return json.dumps(log_data)

class JSONLFormatter(logging.Formatter):
    """Formats logs as JSONL (JSON Lines) for easy machine parsing."""
    def format(self, record: logging.LogRecord) -> str:
        if hasattr(record, "trace_data"):
            return json.dumps(record.trace_data)
        return json.dumps({
            "timestamp": datetime.fromtimestamp(record.created).isoformat(),
            "level": record.levelname,
            "message": record.getMessage()
        })

def setup_logging():
    # Ensure logs directory exists
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    logs_dir = os.path.join(base_dir, "logs")
    workflows_dir = os.path.join(logs_dir, "workflows")
    os.makedirs(workflows_dir, exist_ok=True)

    logger = logging.getLogger("digital_mazdoor")
    logger.setLevel(logging.INFO)
    logger.propagate = False # Prevent double logging in some envs
    
    # 1. Console Handler (Human Friendlyish JSON)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(TraceFormatter())
    logger.addHandler(console_handler)
    
    # 2. Main Orchestrator Log (Human Readable Text)
    main_log_path = os.path.join(logs_dir, "orchestrator.log")
    file_handler = TimedRotatingFileHandler(main_log_path, when="midnight", interval=1, backupCount=7)
    file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
    logger.addHandler(file_handler)

    # 3. Structured Traces Log (JSONL)
    trace_log_path = os.path.join(logs_dir, "traces.jsonl")
    trace_handler = TimedRotatingFileHandler(trace_log_path, when="midnight", interval=1, backupCount=7)
    trace_handler.setFormatter(JSONLFormatter())
    logger.addHandler(trace_handler)

    # 4. Error Log
    error_log_path = os.path.join(logs_dir, "error.log")
    error_handler = logging.FileHandler(error_log_path)
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(module)s - %(message)s'))
    logger.addHandler(error_handler)
    
    return logger

# Initialize logger
dm_logger = setup_logging()

def log_agent_step(agent_id: str, message: str, reasoning: list, decision: Any, status: str = "success"):
    """Helper to log structured agent reasoning steps."""
    trace_data = {
        "agent_id": agent_id,
        "reasoning_logic": reasoning,
        "decision": decision,
        "status": status,
        "timestamp": datetime.now().isoformat()
    }
    dm_logger.info(message, extra={"trace_data": trace_data})

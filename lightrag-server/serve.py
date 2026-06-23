import os
import sys

port = os.environ.get("PORT", "9621")
# Set argv so lightrag's initialize_config() picks up the right host/port
sys.argv = ["lightrag-server", "--host", "0.0.0.0", "--port", port]

from lightrag.api.lightrag_server import main
main()

#!/bin/bash
# Двойной клик по этому файлу — запускает виджет и открывает его в браузере.
cd "$(dirname "$0")"
python3 server.py &
SRV=$!
sleep 1
open "http://localhost:8787"
wait $SRV

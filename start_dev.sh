SESSION=full-stack
tmux -2 new-session -d -s $SESSION

tmux new-window -t $SESSION:0
tmux splitw -h
tmux splitw -h
tmux send-keys -t 0 "cd front-end && npm run start" Enter
tmux send-keys -t 1 "cd movies-api && npm run dev"  Enter
tmux send-keys -t 2 "cd users-api && npm run dev"   Enter

tmux select-window -t $SESSION:0
tmux -2 attach-session -t $SESSION
SESSION=full-stack
tmux -2 new-session -d -s $SESSION

tmux new-window -t $SESSION:0
tmux splitw -h
tmux splitw -v -t 0
tmux splitw -v -t 2

tmux select-pane -t 0 -T Movies-API
tmux select-pane -t 1 -T Users-API 
tmux select-pane -t 2 -T Model-API 
tmux select-pane -t 3 -T Front-end 
tmux set -g pane-border-status top

tmux send-keys -t 0 "cd movies-api && npm run dev"  Enter
tmux send-keys -t 1 "cd users-api && npm run dev"   Enter
tmux send-keys -t 2 ". environ/bin/activate && cd model-api && flask --app app --debug run" Enter
tmux send-keys -t 3 "cd front-end && npm run start" Enter


tmux select-window -t $SESSION:0
tmux -2 attach-session -t $SESSION
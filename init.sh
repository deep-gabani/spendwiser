# To run this script, run this command: ". ./init.sh"


# Activate the conda environment.
ENV_NAME="spendwiser"
ACTIVATE_CONDA_ENV="
    source ~/anaconda3/bin/activate && \
    conda activate $ENV_NAME \
"
conda activate $ENV_NAME


# Go to the repo.
cd ~/personal_projects/spendwiser


# Start the VS Code.
code .


# Start the react-native application.
gnome-terminal \
    --tab \
    --title=App \
    -- bash \
    -c "
        $ACTIVATE_CONDA_ENV && \
        cd app && \
        npm i && \
        npm run start \
        ; bash
    "


# Start the server.
gnome-terminal \
    --tab \
    --title=Server \
    -- bash \
    -c "
        $ACTIVATE_CONDA_ENV && \
        cd server && \
        python3 -m local.main \
        ; bash
    "


# Open the Swagger UI.
sleep 5  # Waiting for the server to be up.
google-chrome \
    http://localhost:5000/api


# Run git status.
sleep 3
git status

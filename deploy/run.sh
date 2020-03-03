#!/bin/bash
echo -e "starting script.sh"

full_path_to_script="$(dirname $(realpath $0))/script.sh"
echo "full_path_to_script: "$full_path_to_script

chmod 700 $full_path_to_script
$full_path_to_script $1


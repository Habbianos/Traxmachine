#!/bin/bash

image_extensions=("jpg" "jpeg" "png" "gif" "bmp" "webp" "tiff" "svg")

find_args=()
for ext in "${image_extensions[@]}"; do
  find_args+=(-iname "*.${ext}")
  find_args+=(-o)
done
unset 'find_args[${#find_args[@]}-1]'

process_directory() {
  local dir="$1"
  mapfile -t image_files < <(find "$dir" -type f \( "${find_args[@]}" \))

  declare -A folder_images
  for img in "${image_files[@]}"; do
    folder=$(dirname "$img")
    folder_images["$folder"]+=$(basename "$img")$'\n'
  done

  for folder in "${!folder_images[@]}"; do
    readme="$folder/README.md"
    echo "Creating README.md in $folder"
    {
      echo "# Images"
      echo
      while read -r line; do
        [[ -n "$line" ]] && echo "- ![$line]($line)"
      done <<< "${folder_images[$folder]}"
    } > "$readme"
  done
}

for input_dir in "$@"; do
  if [[ -d "$input_dir" ]]; then
    process_directory "$input_dir"
  else
    echo "Warning: '$input_dir' is not a directory. Skipping."
  fi
done

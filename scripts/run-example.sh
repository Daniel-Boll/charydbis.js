#!/usr/bin/env bash

# Function to print usage
print_usage() {
	echo "
Usage: $0 --example <example_name>

Options:
  --example    The name of the example to run (should be a file in the examples folder)

Example:
  $0 --example my_example
"
}

print_available_examples() {
	printf "Available examples: "
	ls -1 examples | sed 's/\.ts//'
}

# Parse parameters
while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
	--example)
		EXAMPLE="$2"
		shift # past argument
		shift # past value
		;;
	*)
		print_usage
		exit 1
		;;
	esac
done

# Check if example is provided
if [ -z "$EXAMPLE" ]; then
	print_usage
	exit 1
fi

# Define the example path
EXAMPLE_PATH="examples/${EXAMPLE}/index.ts"

# Check if the example file exists
if [ ! -f "$EXAMPLE_PATH" ]; then
	echo "Example \"${EXAMPLE}\" not found in the examples folder."
	print_available_examples
	exit 1
fi

{ # TODO: Make each example have a unique keyspace, so we can query the keyspace existance and run the migration if not

	# Run the example using pnpm tsx
	pnpm tsx "${EXAMPLE_PATH}"

}

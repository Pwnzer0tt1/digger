#!/usr/bin/env python3

# Copyright (C) 2025 Pwnzer0tt1
# Licensed under GPL-3.0

import argparse
import ipaddress
import os
import shutil
import subprocess
import sys

SURICATA_RULES = "./suricata/rules"
SURICATA_OUTPUT = "./suricata/output"
CTF_CONFIG = "./config/ctf_config.json"
OFFSET_PRINT = 77
DOCKER_COMPOSE_FILENAME = "docker-compose.yaml"


def check_compose_profiles() -> bool:
    """Primitive function to read .env file and check COMPOSE_PROFILES variable"""
    if os.path.exists("./.env"):
        with open("./.env", "r") as f:
            name, value = f.readline().strip().split("=")
            if name == "COMPOSE_PROFILES":
                profiles = value.split(",")
                for p in profiles:
                    if not p in ["A", "B", "C", "dev", "prod"]:
                        return False
                return True
    return False
    
# Terminal colors and formatting
class Colors:
    HEADER = "\033[95m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"
    END = "\033[0m"


def print_banner():
    """Print a nice banner for the application"""
    terminal_width = shutil.get_terminal_size().columns
    banner = """
╔═══════════════════════════════════════════════════════════════╗
║                            DIGGER                             ║
║           CTF Traffic Analysis Tool - by Pwnzer0tt1           ║
╚═══════════════════════════════════════════════════════════════╝
    """

    lines = banner.strip().split("\n")
    for line in lines:
        padding = (terminal_width - len(line)) // 2
        print(" " * max(0, padding) + Colors.CYAN + Colors.BOLD + line + Colors.END)
    print()


def print_separator(char="─", length=OFFSET_PRINT):
    """Print a separator line"""
    print(Colors.BLUE + char * length + Colors.END)


def print_success(message):
    """Print success message with green color"""
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")


def print_info(message):
    """Print info message with blue color"""
    print(f"{Colors.BLUE}ℹ {message}{Colors.END}")


def print_warning(message):
    """Print warning message with yellow color"""
    print(f"{Colors.YELLOW}⚠ {message}{Colors.END}")


def print_error(message):
    """Print error message with red color"""
    print(f"{Colors.RED}✗ {message}{Colors.END}")


def print_progress(message):
    """Print progress message with cyan color"""
    print(f"{Colors.CYAN}▶ {message}{Colors.END}")


def prompt_styled(prompt_text, required=True, default=None, current=None):
    """Styled input prompt with validation"""
    if default:
        prompt_text += f" {Colors.YELLOW}(default: {default}){Colors.END}"
    if current:
        prompt_text += f" {Colors.YELLOW}(current: {current}){Colors.END}"
    prompt_text += f" {Colors.BOLD}→{Colors.END} "

    while True:
        try:
            user_input = input(prompt_text).strip()
            if not user_input and default:
                return default
            if not user_input and current:
                return current
            if user_input or not required:
                return user_input
            print_error("This field cannot be empty. Please try again.")
        except KeyboardInterrupt:
            print("\n")
            print_error("Operation cancelled by user.")
            sys.exit(1)


def show_mode_selection():
    """Display mode selection menu"""
    print_info("Available modes:")
    print(f"  {Colors.BOLD}A{Colors.END} - PCAP Replay Mode")
    print(f"  {Colors.BOLD}B{Colors.END} - Capture Interface Mode")
    print(f"  {Colors.BOLD}C{Colors.END} - PCAP-over-IP Mode (default)")
    print()


def prompt_for_mode():
    """Prompt user for mode selection"""
    print_separator(char="═")
    print(f"{Colors.BOLD}{Colors.CYAN}Mode Selection{Colors.END}".center(OFFSET_PRINT + 12))
    print_separator()

    print_info("Choose a mode to start Digger:")
    print(f"  {Colors.CYAN}A{Colors.END} - PCAP replay mode")
    print(f"  {Colors.CYAN}B{Colors.END} - Capture interface mode")
    print(f"  {Colors.CYAN}C{Colors.END} - PCAP-over-IP mode")
    print()

    while True:
        mode = prompt_styled("Enter mode (A/B/C)", default="C").strip().upper()
        if mode in ["A", "B", "C"]:
            print_separator(char="═")
            print()
            return mode
        print_error("Invalid mode. Please choose from: A, B, C")

def prompt_for_yn(prompt, y_func, n_txt, default_r = "n"):
    while True:
        r = prompt_styled(prompt + " (y/n)", required=False, default=default_r).strip().lower()
        if r in ["y", "yes", "yay", "ye", "yep"]:
            y_func()
            break
        elif r in ["n", "no", "nay", "nop", "nope"]:
            if n_txt is not None:
                print_warning(n_txt)
                print()
            break
        else:
            print_error("Invalid input. Please enter `y` or `n`.")

def prompt_for_rules():
    """Prompt user for Suricata rules selection."""
    print_separator(char="═")
    print(f"{Colors.BOLD}{Colors.CYAN}Rules Selection{Colors.END}".center(OFFSET_PRINT + 12))
    print_separator()
    
    print_info("Place your custom rules inside the file `suricata/rules/suricata.rules`.")
    print_warning("If you're also using default rules, make sure to use unique SIDs for your rules. Check the ranges already used in `suricata/examples_rules/suricata.rules`.")
    print_info("Select 'Others' option if you don't want to use default rules.")
    
    flags_rules = {"others": "Others"}
    for f in os.listdir("./suricata/examples_rules/flags"):
        filename = f.split(".")[0]
        flags_rules[filename.lower()] = filename 
    
    print_info("Choose rules to use for flags identification:")
    for f in flags_rules.values():
        print(f"  {Colors.CYAN}{f}{Colors.END}")
    print()
    
    while True:
        rule = prompt_styled("Enter rule name").strip().lower()
        if rule in flags_rules:
            if rule == "others":
                rule = None
            else:
                with open(f"./suricata/examples_rules/flags/{flags_rules[rule]}.rules", "r") as src, open("./suricata/rules/suricata.rules", "a") as dst:
                    dst.write("\n")
                    dst.write(src.read())
            break
        else:
            print_error("Invalid input.")

    def create_suricata_rules():
        with open("./suricata/examples_rules/suricata.rules", "r") as src, open("./suricata/rules/suricata.rules", "a") as dst:
            dst.write("\n")
            dst.write(src.read())
    prompt_for_yn("Do want to use default rules for Attack & Defence CTFs?", create_suricata_rules, None, default_r="y")
    
    
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


def prompt_for_missing_params(args):
    """Prompt user for missing required parameters with styled interface"""
    print_separator(char="═")
    print(f"{Colors.BOLD}{Colors.CYAN}Configuration Setup for Mode C{Colors.END}".center(OFFSET_PRINT + 12))
    print_separator()

    # Target IP with validation
    if not args.target_ip:
        print_info("Target IP Configuration")
        while True:
            target_ip = prompt_styled("Enter target IP address")
            try:
                ipaddress.ip_address(target_ip)
                args.target_ip = target_ip
                break
            except ValueError:
                print_error("Target IP must be a valid IPv4 or IPv6 address.")

    # Capture device name
    if not args.device:
        print_info("Target capture device name")
        while True:
            device = prompt_styled("Enter capture device name", default="game")
            args.device = device
            break

    # SSH username
    if not args.user:
        print_info("SSH username")
        while True:
            user = prompt_styled("Enter SSH username", default="root")
            args.user = user
            break

    # SSH key path with validation
    print_info("SSH Key Algorithm Configuration")
    while True:
        key = prompt_styled("Enter SSH key path (e.g. ~/.ssh/id_ed25519)")
        key = key.replace("~", os.environ["HOME"])
        if os.path.isfile(key):
            args.key = key
            break
        print_error("Can't find the file. Make sure to enter a valid path.")


def compose_down() -> bool:
    """Stop and remove containers"""
    print_progress("Stopping running containers...")

    if not check_compose_profiles():
        print_error("Can't find COMPOSE_PROFILES env variable.")
        sys.exit(1)

    cmd = ["docker", "compose", "down", "--remove-orphans"]
    print_progress(f"Executing: {' '.join(cmd)}")

    try:
        subprocess.run(cmd, check=True)
        print_success("Containers successfully stopped and removed!")
        print()
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to stop containers: {e}")
        print_info("Make sure Docker is running and accessible.")
        print()
        return False


def compose_stop():
    """Stop containers"""
    print_progress("Stopping running containers...")

    if not check_compose_profiles():
        print_error("Can't find COMPOSE_PROFILES env variable.")
        sys.exit(1)

    cmd = ["docker", "compose", "stop"]
    print_progress(f"Executing: {' '.join(cmd)}")

    try:
        subprocess.run(cmd, check=True)
        print_success("Containers successfully stopped!")
        print()
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to stop containers: {e}")
        print_info("Make sure Docker is running and accessible.")
        print()
        return False


def compose_up(build=False):
    """Start containers defined in the specified docker-compose file"""

    if not check_compose_profiles():
        print_error("Can't find COMPOSE_PROFILES env variable.")
        sys.exit(1)

    cmd = ["docker", "compose", "up", "-d"]
    if build:
        cmd.append("--build")

    print_progress(f"Executing: {' '.join(cmd)}")

    try:
        subprocess.run(cmd, check=True)
        print_success("Containers successfully started!")
        print()
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to start containers: {e}")
        print_info("Check if all required images and dependencies are available.")
        sys.exit(1)


def clear_suricata():
    """Clean the Suricata output directory"""
    if not os.path.exists(SURICATA_OUTPUT):
        print_warning("Suricata output directory not found. Skipping clear operation.")
        os.makedirs(SURICATA_OUTPUT, exist_ok=True)
        return

    if not os.listdir(SURICATA_OUTPUT):
        print_info("Suricata output directory already empty. Skipping clear operation.")
        return

    cmd = "sudo rm -rf ./suricata/output/*"
    print_progress("Cleaning Suricata output directory...")
    try:
        subprocess.run(cmd, check=True, shell=True)
        print_success("Suricata output directory cleaned successfully!")
        print()
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to clean Suricata output directory: {e}")
        print_warning("You may need to check permissions or run with appropriate privileges.")
        print()


def clear_suricata_rules():
    """Clean the Suricata rules directory"""
    if not os.path.exists(SURICATA_RULES):
        print_warning("Suricata rules directory not found. Skipping clear operation.")
        os.makedirs(SURICATA_RULES, exist_ok=True)
        return

    if not os.listdir(SURICATA_RULES):
        print_info("Suricata rules directory already empty. Skipping clear operation.")
        return

    cmd = "sudo rm -rf ./suricata/rules/*"
    print_progress("Cleaning Suricata rules directory...")
    try:
        subprocess.run(cmd, check=True, shell=True)
        print_success("Suricata rules directory cleaned successfully!")
        print()
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to clean Suricata rules directory: {e}")
        print_warning("You may need to check permissions or run with appropriate privileges.")
        print()

def clear_config():
    """Clean the Digger config directory"""
    if not os.path.exists("./config"):
        print_warning("Config Digger directory not found. Skipping clear operation.")
        os.makedirs("./config", exist_ok=True)
        return

    cmd = "sudo rm -rf ./config/*"
    print_progress("Cleaning Digger config output directory...")
    try:
        subprocess.run(cmd, check=True, shell=True)
        print_success("Digger config rules directory cleaned successfully!")
        print()
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to clean Digger config rules directory: {e}")
        print_warning("You may need to check permissions or run with appropriate privileges.")
        print()

def clear_volume():
    """Delete the `digger_pgdata` volume"""
    try:
        print_info("Checking if Digger database volume exists.")
        subprocess.run("docker volume inspect digger_pgdata", check=True, shell=True, capture_output=True)
    except subprocess.CalledProcessError:
        print_warning("Digger database volume `digger_pgdata` doesn't exists, skipping clear operation.")
        return
        
    cmd = "docker volume rm digger_pgdata"
    print_progress("Removing Digger database volume...")
    try:
        subprocess.run(cmd, check=True, shell=True)
        print_success("Digger database volume removed successfully!")
        print()
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to remove Digger database volume directory: {e}")
        print_warning("You may need to check permissions or run with appropriate privileges.")
        print()


def handle_start_command(args):
    """Handle the start command"""
    print_progress("Starting Digger...\n")

    if args.mode_a:
        mode = "A"
    elif args.mode_b:
        mode = "B"
    elif args.mode_c:
        mode = "C"
    else:
        # Interactive mode selection
        mode = prompt_for_mode()

    with open("./.env", "w") as f:
        f.write(f"COMPOSE_PROFILES={mode}")
        if args.dev:
            f.write(",dev")
        else:
            f.write(",prod")

    # Stop existing containers
    compose_down()

    # Handle clear option - skip if --no-clean is specified
    if args.no_clean:
        print_info("Skipping environment cleaning due to --no-clean flag...")
        print_warning("Suricata output directory will not be cleared.")
        print()
    else:
        # Clear Suricata output
        prompt_for_yn("Do you want to clear Suricata output directory?", clear_suricata, "Suricata output directory will not be cleared.")
        # Clear Suricata rules
        prompt_for_yn("Do you want to clear Suricata rules directory?", clear_suricata_rules, "Suricata rules directory will not be cleared.")
        # Clear Digger config
        prompt_for_yn("Do you want to clear Digger config directory?", clear_config, "Digger config rules directory will not be cleared.")
        # Remove Digger database volume
        prompt_for_yn("Do you want to clear Digger database volume directory?", clear_volume, "Digger database volume will not be removed.")
    
    prompt_for_rules()

    # Mode-specific initialization
    if mode == "A":
        print_progress("Initializing mode A (pcap replay)...")
    elif mode == "B":
        print_progress("Initializing mode B (capture interface)...")
    elif mode == "C":
        print_progress("Initializing mode C (PCAP-over-IP)...\n")

        prompt_for_missing_params(args)

        with open(".env", "a") as env_file:
            env_file.write(f"KEY=\"{args.key}\"\n")
            env_file.write(f"PCAP_COMMAND=\"ssh {args.user}@{args.target_ip} -i /root/.ssh/identity -oStrictHostKeyChecking=no\nsudo  tcpdump -U --immediate-mode -ni {args.device} -s 65535 -w - not tcp port 22\"")
            
    print_separator(char="═")
    print_success("Configuration completed successfully!")
    print_separator(char="═")
    print()

    # Start the containers using the selected docker-compose file
    compose_up(args.build)

    print_separator(char="═")
    print_success(f"Digger successfully started in mode {mode}!")
    print(f"  {Colors.BOLD}Web interface:{Colors.END} {Colors.CYAN}http://127.0.0.1:8000{Colors.END}")
    print(f"  {Colors.BOLD}Grafana interface:{Colors.END} {Colors.CYAN}http://127.0.0.1:8001{Colors.END}")
    print_separator(char="═")


def handle_stop_command():
    """Handle the stop command"""
    print_progress("Stopping Digger...")

    compose_stop()
    
    print_success("Operation completed successfully!")


def handle_clear_command(args):
    """Handle the clear command with granular options"""
    print_progress("Clearing data...")

    # If no specific options, default to clearing output and stopping containers
    if not (args.all or args.suricata or args.rules):
        print_info("No specific clear option provided.\n")

        # Stop containers first
        compose_down()

        # Clear Suricata output
        prompt_for_yn("Do you want to clear Suricata output directory?", clear_suricata, "Suricata output directory will not be cleared.")
        # Clear Suricata rules
        prompt_for_yn("Do you want to clear Suricata rules directory?", clear_suricata_rules, "Suricata rules directory will not be cleared.")

        return

    # Handle --all option
    if args.all:
        print_info("Clearing everything...")

        # Stop containers
        compose_down()

        # Clear Suricata output
        clear_suricata()
        
        # Clear Suricata rules
        clear_suricata_rules()

        # Clear Digger config
        clear_config()

        # Clear Digger database volume
        clear_volume()

        print_success("All data cleared successfully!")
        return

    # Handle granular options
    cleared_items = []

    if args.suricata:
        # Stop containers first if clearing output - check if compose file exists
        compose_down()

        clear_suricata()
        cleared_items.append("Suricata output")

    if args.rules:
        clear_suricata_rules()
        cleared_items.append("Suricata rules")

    if cleared_items:
        print_success(f"Cleared: {', '.join(cleared_items)}")
    else:
        print_info("Nothing to clear.")


def handle_status_command():
    """Handle the status command - show container status"""
    print_progress("Checking Digger status...")

    if not check_compose_profiles():
        print_error("Can't find COMPOSE_PROFILES env variable.")
        sys.exit(1)

    # Always show container status
    print_info("Container Status:")
    cmd = ["docker", "compose", "ps"]
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to get container status: {e}")
        print_info("Make sure Docker is running and accessible.")
    print()


def handle_logs_command(args):
    """Handle the logs command - follow container logs"""
    print_progress("Following container logs...")

    if not check_compose_profiles():
        print_error("Can't find COMPOSE_PROFILES env variable.")
        sys.exit(1)

    # Build logs command
    cmd = ["docker", "compose", "logs", "-f"]

    # Add arguments directly from sys.argv instead of parsed args
    if len(sys.argv) > 2:  # If there are arguments after "logs"
        cmd.extend(sys.argv[2:])  # Take everything after "logs"

    print_progress(f"Executing: {' '.join(cmd)}")
    try:
        result = subprocess.run(cmd, check=False)
        sys.exit(result.returncode)
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to follow logs: {e}")
        print_info("Make sure containers are running and Docker is accessible.")
        sys.exit(1)


def handle_help_command():
    """Handle the help command - show help information"""
    parser = create_parser()
    parser.print_help()


def create_parser():
    """Create and configure the argument parser"""
    parser = argparse.ArgumentParser(
        description="Digger - CTF Traffic Analysis Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        add_help=False,  # Disable default -h/--help
        epilog=f"""
{Colors.BOLD}Examples:{Colors.END}
  {Colors.CYAN}./run.py start --mode-a{Colors.END}                         # Start Digger in mode A
  {Colors.CYAN}./run.py start --mode-c --target-ip 10.60.2.1{Colors.END}   # Start mode C with target IP
  {Colors.CYAN}./run.py stop{Colors.END}                                   # Stop running containers
  {Colors.CYAN}./run.py clear{Colors.END}                                  # Clear output, clear database and stop containers
  {Colors.CYAN}./run.py clear --all{Colors.END}                            # Clear everything
  {Colors.CYAN}./run.py clear --suricata-output{Colors.END}                # Clear only Suricata output
  {Colors.CYAN}./run.py status{Colors.END}                                 # Show container status
  {Colors.CYAN}./run.py logs{Colors.END}                                   # Follow all container logs
  {Colors.CYAN}./run.py logs --tail 100{Colors.END}                        # Last 100 logs of all containers
  {Colors.CYAN}./run.py logs webapp --tail 50{Colors.END}                  # Last 50 logs of specific service
  {Colors.CYAN}./run.py help{Colors.END}                                   # Show this help message
        """,
    )

    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Help command
    subparsers.add_parser("help", help="Show help information")

    # Start command
    parser_start = subparsers.add_parser("start", help="Start Digger")
    mode_group = parser_start.add_mutually_exclusive_group()
    mode_group.add_argument(
        "--mode-a", action="store_true", help="Start in mode A (pcap replay)"
    )
    mode_group.add_argument(
        "--mode-b", action="store_true", help="Start in mode B (capture interface)"
    )
    mode_group.add_argument(
        "--mode-c", action="store_true", help="Start in mode C (PCAP-over-IP)"
    )
    parser_start.add_argument(
        "--dev", action="store_true", help="Start Digger using containers in dev mode"
    )
    
    parser_start.add_argument(
        "--build", action="store_true", help="Build images instead of pulling from GHCR"
    )
    parser_start.add_argument(
        "--no-clean", action="store_true", help="Skip cleaning environment"
    )
    parser_start.add_argument(
        "--target-ip",
        "-ip",
        dest="target_ip",
        help="Specify target machine IP address (for mode C)",
    )
    parser_start.add_argument(
        "--device",
        "-d",
        dest="device",
        help="Name of the device used to capture traffic on the remote machine (default: game)"
    )
    parser_start.add_argument(
        "--key",
        "-k",
        dest="key",
        help="Specify SSH private key file (e.g. ~/.ssh/id_ed25519)",
    )
    parser_start.add_argument(
        "--user",
        "-u",
        dest="user",
        help="Specify username for SSH login (default: root)"
    )

    # Stop command
    subparsers.add_parser("stop", help="Stop Digger containers")

    # Clear command
    parser_clear = subparsers.add_parser("clear", help="Clean Suricata output, db volume and stop containers")
    parser_clear.add_argument(
        "--all",
        action="store_true",
        help="Clear everything (containers, output, config)",
    )
    parser_clear.add_argument(
        "--suricata-output",
        action="store_true",
        help="Clean Suricata output and stop containers",
    )
    parser_clear.add_argument(
        "--suricata-rules",
        action="store_true",
        help="Clean Suricata rules and stop containers",
    )
    parser_clear.add_argument(
        "--config",
        action="store_true",
        help="Clean Digger configs and stop containers"
    )
    parser_clear.add_argument(
        "--database",
        action="store_true",
        help="Clean database volume and stop containers"
    )

    # Status command - simple container status
    subparsers.add_parser("status", help="Show container status")

    # Logs command - NO ARGUMENTS, uses sys.argv directly
    subparsers.add_parser("logs", help="Follow container logs")

    return parser


def show_action_selection():
    """Display action selection menu"""
    print_info("Available actions:")
    print(f"  {Colors.BOLD}start{Colors.END} - Build and start containers")
    print(f"  {Colors.BOLD}stop{Colors.END} - Stop running containers, if any")
    print(f"  {Colors.BOLD}clear{Colors.END} - Clear Suricata's output, and stop containers")
    print(f"  {Colors.BOLD}status{Colors.END} - Show container status")
    print(f"  {Colors.BOLD}logs{Colors.END} - Follow container logs")
    print(f"  {Colors.BOLD}help{Colors.END} - Show help information")
    print()


def prompt_for_action():
    """Prompt user for action selection"""
    print_separator(char="═")
    print(f"{Colors.BOLD}{Colors.CYAN}Action Selection{Colors.END}".center(OFFSET_PRINT + 12))
    print_separator()

    show_action_selection()

    while True:
        action = (
            prompt_styled(
                "Enter action (start/stop/clear/status/logs/help)", default="start"
            )
            .strip()
            .lower()
        )
        if action in ["start", "stop", "clear", "status", "logs", "help"]:
            print_separator(char="═")
            print()
            return action
        print_error(
            "Invalid action. Please choose from: start, stop, clear, status, logs, help"
        )


def main():
    # Check if Docker compose file exists
    if not os.path.exists(DOCKER_COMPOSE_FILENAME):
        print_error("Docker compose file not found.")
        sys.exit(1)
    
    # Clear screen and show banner
    os.system("clear" if os.name == "posix" else "cls")
    print_banner()

    # Handle logs command BEFORE argparse to avoid --tail conflicts
    if len(sys.argv) >= 2 and sys.argv[1] == "logs":
        # Call logs handler directly with raw arguments
        class MockArgs:
            pass

        args = MockArgs()
        handle_logs_command(args)
        return

    parser = create_parser()

    # If no arguments provided, enter interactive mode
    if len(sys.argv) == 1:
        action = prompt_for_action()
        args = parser.parse_args([action])
    else:
        args = parser.parse_args()

    # Handle commands (logs is already handled above)
    if args.command == "help":
        handle_help_command()
    elif args.command == "start":
        handle_start_command(args)
    elif args.command == "stop":
        handle_stop_command()
    elif args.command == "clear":
        handle_clear_command(args)
    elif args.command == "status":
        handle_status_command()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
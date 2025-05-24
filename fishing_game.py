import tkinter as tk
import random

# --- Game State Variables ---
fish_is_biting = False
fish_caught_count = 0
escape_timer_id = None # To store the ID of the root.after timer for fish escapes
line_id = None # To store the ID of the visual fishing line on the canvas

# Create the main application window
root = tk.Tk()

# Set the title of the window
root.title("Tkinter Fishing Game")

# Set initial dimensions for the window
root.geometry("800x600") # Increased size for better layout

# --- Create Frames ---

# Fishing Area (Canvas)
# Added borderwidth and relief for a distinct border
fishing_area_frame = tk.Canvas(root, bg="lightblue", width=780, height=400, borderwidth=2, relief="sunken")
fishing_area_frame.pack(pady=10, padx=10, fill="both", expand=True)

# Control Panel (Frame)
# Added background color and adjusted padding for the frame itself
control_panel_frame = tk.Frame(root, bd=2, relief=tk.SUNKEN, bg="lightgrey")
control_panel_frame.pack(pady=(0, 10), padx=10, fill="x") # Adjusted pady to have less space above if needed

# --- Variables for Dynamic Text ---
message_text = tk.StringVar()
fish_caught_text = tk.StringVar()

# Initialize dynamic text
message_text.set("Welcome! Cast your line to begin.")
fish_caught_text.set(f"Fish Caught: {fish_caught_count}")

# --- Function Definitions ---

def cast_line():
    global fish_is_biting, escape_timer_id, line_id
    fish_is_biting = False

    # Remove old line if it exists
    if line_id:
        fishing_area_frame.delete(line_id)
        line_id = None

    cast_line_button.config(state=tk.DISABLED)
    reel_in_button.config(state=tk.DISABLED) 
    message_text.set("Line cast... please wait.")

    # Draw the fishing line
    canvas_width = fishing_area_frame.winfo_width()
    if canvas_width <= 1: # If canvas not yet drawn, use default
        canvas_width = 780 
    line_x = canvas_width / 2
    # Line from top-center to about 2/3 down the canvas
    line_id = fishing_area_frame.create_line(line_x, 0, line_x, fishing_area_frame.winfo_height() * 0.66, fill="black", width=2)
    
    # Cancel any existing escape timer
    if escape_timer_id:
        root.after_cancel(escape_timer_id)
        escape_timer_id = None
    
    delay_ms = random.randint(1000, 5000)
    root.after(delay_ms, check_for_fish)

def check_for_fish():
    global fish_is_biting, escape_timer_id, line_id
    
    # If the cast_line_button is still disabled, it means we are in the "waiting for fish" phase
    if cast_line_button['state'] == tk.DISABLED:
        if random.random() < 0.6: # 60% chance to get a bite
            fish_is_biting = True
            message_text.set("A fish is on the line! Reel it in!")
            reel_in_button.config(state=tk.NORMAL)
            
            # Schedule the fish_escapes timer
            escape_timer_id = root.after(3000, fish_escapes) # 3 seconds to reel in
        else:
            fish_is_biting = False
            message_text.set("Nothing biting this time. Try again.")
            cast_line_button.config(state=tk.NORMAL)
            reel_in_button.config(state=tk.DISABLED)
    # Else, it means the player might have already reeled in or the fish escaped, so do nothing.

def fish_escapes():
    global fish_is_biting, escape_timer_id
    
    if fish_is_biting: # Check if fish was indeed biting (player didn't reel in)
        fish_is_biting = False
        message_text.set("Oh no! The fish got away!")
        reel_in_button.config(state=tk.DISABLED)
        cast_line_button.config(state=tk.NORMAL)
        if line_id:
            fishing_area_frame.delete(line_id)
            line_id = None
    escape_timer_id = None # Clear the timer ID

def reel_in():
    global fish_is_biting, fish_caught_count, escape_timer_id, line_id

    # Cancel the escape timer if it's active
    if escape_timer_id:
        root.after_cancel(escape_timer_id)
        escape_timer_id = None
    
    # Remove fishing line from canvas
    if line_id:
        fishing_area_frame.delete(line_id)
        line_id = None

    if fish_is_biting:
        fish_caught_count += 1
        fish_caught_text.set(f"Fish Caught: {fish_caught_count}")
        message_text.set("Congratulations! You caught a fish!")
        fish_is_biting = False
    else:
        message_text.set("Nothing to reel in, or you were too slow.")

    reel_in_button.config(state=tk.DISABLED)
    cast_line_button.config(state=tk.NORMAL)


# --- Add Widgets to Control Panel ---

# Buttons
# Adjusted padding and added font/bg styling
cast_line_button = tk.Button(control_panel_frame, text="Cast Line", command=cast_line, 
                             bg="lightgreen", font=("Arial", 10, "bold"))
cast_line_button.pack(side=tk.LEFT, padx=(10,5), pady=10) # Tuple for padx: (left, right)

reel_in_button = tk.Button(control_panel_frame, text="Reel In", state=tk.DISABLED, command=reel_in,
                           bg="lightblue", font=("Arial", 10, "bold"))
reel_in_button.pack(side=tk.LEFT, padx=5, pady=10)

# Labels
# Adjusted padding and added font styling
message_label = tk.Label(control_panel_frame, textvariable=message_text, wraplength=400, 
                         font=("Arial", 10), bg="lightgrey") # Match control panel bg
message_label.pack(side=tk.LEFT, padx=(10,5), pady=10, expand=True, fill="x")

fish_caught_label = tk.Label(control_panel_frame, textvariable=fish_caught_text, 
                             font=("Arial", 10, "bold"), bg="lightgrey") # Match control panel bg
fish_caught_label.pack(side=tk.RIGHT, padx=(5,10), pady=10)


# Ensure the window can be closed properly (Tkinter handles this by default with mainloop)
# For now, we are just setting up the window structure.

# The mainloop will be started now.
root.mainloop()

# Optional: Add a print statement to confirm script execution if run directly
# This print statement might not be visible if the mainloop is blocking
# and the script is run from certain environments.
if __name__ == "__main__":
    print("fishing_game.py executed and mainloop started.")

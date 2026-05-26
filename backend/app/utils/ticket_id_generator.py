import random
import string
from typing import Optional


def generate_ticket_id(prefix: str = "TKT", length: int = 3) -> str:
    """
    Generate a ticket ID with the specified prefix and numeric length.
    
    Args:
        prefix: The prefix for the ticket ID (default: "TKT")
        length: The length of the numeric part (default: 3)
        
    Returns:
        A ticket ID string like "TKT-001"
    """
    # Generate a random number with leading zeros
    number = random.randint(0, 10**length - 1)
    formatted_number = str(number).zfill(length)
    return f"{prefix}-{formatted_number}"


def generate_unique_ticket_id(
    prefix: str = "TKT", length: int = 3, existing_ids: Optional[set] = None
) -> str:
    """
    Generate a unique ticket ID that doesn't conflict with existing IDs.
    
    Args:
        prefix: The prefix for the ticket ID (default: "TKT")
        length: The length of the numeric part (default: 3)
        existing_ids: A set of existing ticket IDs to avoid conflicts
        
    Returns:
        A unique ticket ID string
    """
    if existing_ids is None:
        existing_ids = set()
        
    max_attempts = 100
    for _ in range(max_attempts):
        ticket_id = generate_ticket_id(prefix, length)
        if ticket_id not in existing_ids:
            return ticket_id
            
    # If we can't generate a unique ID after max_attempts, increase the length
    return generate_ticket_id(prefix, length + 1)
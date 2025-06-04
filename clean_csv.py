import pandas as pd

# Load only 15 columns
df = pd.read_csv("roofnet_metadata_utf8.csv", usecols=range(15))

# Save cleaned CSV with proper quoting to avoid delimiter issues
df.to_csv("roofnet_metadata_clean.csv", index=False, quoting=1)  # quoting=1 is csv.QUOTE_ALL

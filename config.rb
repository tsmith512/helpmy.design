# Require any additional compass plugins here.
require 'compass'
require 'breakpoint'
require 'toolkit'

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "css"
sass_dir = "scss"
images_dir = "gfx"
javascripts_dir = "js"
fonts_dir = "css/fonts"

# To enable relative paths to assets via compass helper functions. Since Drupal themes can be installed in multiple locations, we shouldn't need to worry about the absolute path to the theme from the server root.
relative_assets = true

# To enable debugging comments that display the original location of your selectors. Comment:
line_comments = false

# In development, we can turn on the debug_info to use with FireSass or Chrome Web Inspector. Uncomment:
# debug = true

# Disable cache busting on image assets
asset_cache_buster :none

# You can select your preferred output style here (can be overridden via the command line):
output_style = :nested


# Use official nginx image
FROM nginx:alpine

# Copy the built Angular app to Nginx's web directory
COPY dist/qr-swtich-portal/browser /usr/share/nginx/html

# Optional: custom nginx config to support Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

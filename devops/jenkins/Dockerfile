FROM jenkins/jenkins:lts

USER root

RUN apt-get update

# Docker CLI telepítése
RUN apt-get install -y ca-certificates curl gnupg

RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
RUN chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository to APT sources
RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update && apt-get install -y docker-ce-cli
RUN apt-get update && apt-get install -y libatomic1

# Install Node
RUN curl -fsSL https://deb.nodesource.com/setup_25.x | bash - \
  && apt-get install -y nodejs

# Chromium for Karma
RUN apt-get update && apt-get install -y chromium
ENV CHROME_BIN=/usr/bin/chromium

# Create the docker group
RUN groupadd -f docker

# Add jenkins user to the docker group
RUN usermod -aG docker jenkins

# Install sudo if not already present
RUN apt-get update && apt-get install -y sudo

# Allow jenkins user to run specific commands with sudo without password
RUN echo "jenkins ALL=(ALL) NOPASSWD: /usr/bin/chown" >> /etc/sudoers.d/jenkins

# Set up entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Install plugins
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

# Add JCasC configuration
ENV CASC_JENKINS_CONFIG=/var/jenkins_home/casc_configs/jenkins.yaml
COPY jenkins.yaml /usr/share/jenkins/ref/casc_configs/jenkins.yaml

# Copy job config
COPY jobs /usr/share/jenkins/ref/jobs

# Switch to jenkins user
USER jenkins

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["/usr/bin/tini", "--", "/usr/local/bin/jenkins.sh"]
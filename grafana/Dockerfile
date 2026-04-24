FROM grafana/grafana:12.4

ENV GF_LOG_LEVEL="warn"
ENV GF_ANALYTICS_CHECK_FOR_PLUGINS_UPDATES="false"
ENV GF_ANALYTICS_CHECK_FOR_UPDATES="false"
ENV GF_ANALYTICS_REPORTING_ENABLED="false"
ENV GF_AUTH_ANONYMOUS_ENABLED="true"
ENV GF_AUTH_ANONYMOUS_HIDE_VERSION="true"
ENV GF_DASHBOARDS_DEFAULT_HOME_DASHBOARD_PATH="/var/lib/grafana/dashboards/home.json"

COPY ./provisioning /etc/grafana/provisioning
COPY ./dashboards/home.json /var/lib/grafana/dashboards/home.json

ENTRYPOINT [ "/run.sh" ]
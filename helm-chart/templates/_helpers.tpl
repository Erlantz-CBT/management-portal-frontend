{{/*
Expand the name of the chart.
*/}}
{{- define "application.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "application.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "application.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Name of the component frontend.
*/}}
{{- define "frontend.name" -}}
{{- printf "%s-frontend" (include "application.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified component frontend name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "frontend.fullname" -}}
{{- printf "%s-frontend" (include "application.fullname" .) | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
Component frontend labels.
*/}}
{{- define "frontend.labels" -}}
helm.sh/chart: {{ include "application.chart" . }}
{{ include "frontend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Component frontend selector labels.
*/}}
{{- define "frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "application.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: frontend
isMainInterface: "yes"
tier: {{ .Values.frontend.tier }}
{{- end }}

{{/*
Return the CORS Allow Origin header value
*/}}
{{- define "frontend.cors.allowOrigin" -}}
{{- if .Values.frontend.ingress.tls.enabled }}
    {{- printf "https://%s" .Values.frontend.ingress.hostname -}}
{{- else -}}
    {{- printf "http://%s" .Values.frontend.ingress.hostname -}}
{{- end -}}
{{- end -}}


{{/*
Name of the component backend.
*/}}
{{- define "backend.name" -}}
{{- printf "%s-backend" (include "application.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified component backend name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "backend.fullname" -}}
{{- printf "%s-backend" (include "application.fullname" .) | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
Component backend labels.
*/}}
{{- define "backend.labels" -}}
helm.sh/chart: {{ include "application.chart" . }}
{{ include "backend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Component backend selector labels.
*/}}
{{- define "backend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "application.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: backend
isMainInterface: "no"
tier: {{ .Values.backend.tier }}
{{- end }}


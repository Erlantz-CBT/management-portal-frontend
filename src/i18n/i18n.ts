import {createI18n} from 'vue-i18n';

/**
 * I18n module
 * About vue-i18n: https://vue-i18n.intlify.dev/
 */

const i18n =  createI18n(Object.freeze({
    locale: localStorage.getItem('i18n') || 'en',
    fallbackLocale: 'en',
    messages: {
        en: {
            general: {
                deleteConfirm: "Are you sure you want to delete",
                stopConfirm: "Are you sure you want to stop",
                startConfirm: "Are you sure you want to start",
                name: "Name",
                accessDenied: "Access denied",
                contactAdmin: "Please contact your system administrator"
            },
            filter: {
              noResults: "No results",
              results: "Results",
              clear: "Clear"
            },
            sidebar: {
                home: 'Home',
                domains: 'Domains',
                deployments: 'Deployments',
                notifications: 'Notifications',
                users: 'Users',
                settings: 'Settings'
            },
            home: {
              welcome: 'Welcome to the aeriOS Management Portal',
              subtitle: 'This is the Management Portal, the single entrypoint to manage the aeriOS Meta-OS'
            },
            domains: {
                domainsList: 'Domains list',
                description: 'Description',
                publicUrl: 'Public Url',
                owner: 'Owner',
                entrypoint: 'Entrypoint',
                status: 'Status',
                view: 'View',
                domainDetail: 'Domain detail',
                infrastructureElements: 'Infrastructure elements',
                metrics: 'Metrics'
            },
            deployments: {
                deployedServices: 'Deployed services',
                description: 'Description',
                name: 'Name',
                deployAsJob: "Deploy as job",
                serviceOverlay: 'Service overlay',
                actions: 'Actions',
                newServiceDeployment: 'New service deployment',
                serviceDetail: 'Service detail',
                serviceComponents: 'Service components',
                containerImage: 'Container image',
                status: 'Status',
                newDeployment: 'Deploy a new service',
                service: 'Service',
                deploymentName: 'Insert name',
                numberOfComponents: 'Components',
                componentNumber: 'Component number',
                next: 'Next',
                selectedIE: 'Selected IE',
                manual: 'Manual',
                semiAutomatic: 'Semi-automatic',
                automatic: 'Automatic',
                networkPorts: 'Network ports',
                cpuUsage: 'CPU usage',
                requiredRam: 'Required RAM',
                cpuArch: 'CPU architecture',
                summary: 'Summary',
                component: 'Component | Components',
                generalData: 'General data',
                confirmDeploy: 'Confirm and deploy service',
                deleteService: 'Delete service',
                exposed: '(exposed)',
                notExposed: '(not exposed)',
            },
            dataCatalog: {
              deleteDataProduct: 'Delete Data product',
              addDataProduct: "Add Data product",
              owners: "Owners",
              glossary: "Glossary terms",
              tags: "Tags",
              dataType: "Data type",
              allDataType: "All data types",
              allGlossary: "All glossary terms",
              allTags: "All tags",
              allOwners: "All owners"
            },
            settings: {
                settings: 'Settings',
                generalSettings: 'General settings',
                systemSettings: 'System settings',
                darkMode: 'Dark mode',
                language: 'Language',
                fontSize: 'Font size',
                pushNotification: 'Push notification',
                metrics: 'IE metric visualization'
            },
            notifications: {
              type: 'Type',
              description: 'Description',
              date: 'Date',
              priority: 'Priority',
              deleteNotification: 'Delete notification'
            },
            users: {
              newUser: 'Add a new user',
              userData: 'Fill the form with the required data',
              confirm: 'Confirm and create user',
              name: "Name",
              role: "Role",
              status: "Status",
              allRoles: "All roles",
              allStatus: "All status"
            },
            wip: {
                workInProgress: "Work in progress"
            }
        },
        it: {
            general: {
                deleteConfirm: "Sei sicuro di voler eliminare",
                stopConfirm: "Sei sicuro di voler fermare",
                startConfirm: "Sei sicuro di voler avviare",
                name: "Nome",
                accessDenied: "Accesso negato",
                contactAdmin: "Si prega di contattare l'amministratore del sistema"
            },
            filter: {
                noResults: "Nessun risultato",
                results: "Risultati",
                clear: "Pulisci"
            },
            sidebar: {
                home: 'Home',
                domains: 'Domini',
                deployments: 'Istanze',
                notifications: 'Notifiche',
                users: 'Utenti',
                settings: 'Impostazioni'
            },
            home: {
                welcome: 'Benvenuto nel Portale di Gestione di aeriOS',
                subtitle: 'Questo è il Portale di Gestione, il punto di accesso unico per gestire il Meta-OS di aeriOS'
            },
            domains: {
                domainsList: 'Lista dei domini',
                description: 'Descrizione',
                publicUrl: 'Url pubblico',
                owner: 'Proprietario',
                entrypoint: 'Punto di ingresso',
                status: 'Stato',
                view: 'Visualizza',
                domainDetail: 'Dettaglio del dominio',
                infrastructureElements: "Elementi dell'infrastruttura",
                metrics: "Metriche"
            },
            deployments: {
                deployedServices: 'Istanze rilasciate',
                description: 'Descrizione',
                name: 'Nome',
                deployAsJob: "Rilascia come job",
                serviceOverlay: 'Overlay del servizio',
                actions: 'Azioni',
                newServiceDeployment: 'Nuova istanza',
                serviceDetail: 'Dettaglio del servizio',
                serviceComponents: 'Componenti del servizio',
                containerImage: 'Immagine del container',
                status: 'Stato',
                newDeployment: 'Rilascia una nuova istanza',
                service: 'Istanza',
                deploymentName: 'Inserisci nome',
                numberOfComponents: 'Numero di componenti',
                componentNumber: 'Componente numero',
                next: 'Avanti',
                selectedIE: 'IE selezionato',
                manual: 'Manuale',
                semiAutomatic: 'Semi-automatico',
                automatic: 'Automatico',
                networkPorts: 'Porte di rete',
                cpuUsage: 'Utilizzo CPU',
                requiredRam: 'RAM richiesta',
                cpuArch: 'Architettura CPU',
                summary: 'Riepilogo',
                component: 'Componente | Componenti',
                generalData: 'Dati generali',
                confirmDeploy: 'Conferma e rilascia la nuova istanza',
                deleteService: 'Elimina istanza',
                exposed: '(esposta)',
                notExposed: '(non esposta)'
            },
            dataCatalog: {
                deleteDataProduct: 'Elimina prodotto dati',
                addDataProduct: 'Aggiungi prodotto dati',
                owners: 'Proprietari',
                glossary: 'Termini del glossario',
                tags: 'Tag',
                dataType: 'Tipo di dati',
                allDataType: 'Tutti i tipi di dati',
                allGlossary: 'Tutti i termini del glossario',
                allTags: 'Tutti i tag',
                allOwners: 'Tutti i proprietari'
            },
            settings: {
                settings: 'Impostazioni',
                generalSettings: 'Impostazioni generali',
                systemSettings: 'Impostazioni di sistema',
                darkMode: 'Tema scuro',
                language: 'Lingua',
                fontSize: 'Dimensione font',
                pushNotification: 'Notifiche push',
                metrics: 'Visualizzazione metriche IE'
            },
            notifications: {
                type: 'Tipo',
                description: 'Descrizione',
                date: 'Data',
                priority: 'Priorità',
                deleteNotification: 'Elimina notifica'
            },
            users: {
                newUser: 'Aggiungi un nuovo utente',
                userData: 'Compila il modulo con i dati richiesti',
                confirm: 'Conferma e crea utente',
                name: 'Nome',
                role: 'Ruolo',
                status: 'Stato',
                allRoles: "Tutti i ruoli",
                allStatus: "Tutti gli stati"
            },
            wip: {
                workInProgress: "Presto disponibile"
            }
        },
        es: {
            general: {
                deleteConfirm: "¿Estás seguro de que deseas eliminar?",
                stopConfirm: "¿Estás seguro de que quieres detener?",
                startConfirm: "¿Estás seguro de que quieres iniciar",
                name: "Nombre",
                accessDenied: "Acceso denegado",
                contactAdmin: "Por favor, contacta al administrador del sistema"
            },
            filter: {
                noResults: "Sin resultados",
                results: "Resultados",
                clear: "Borrar"
            },
            sidebar: {
                home: 'Home',
                domains: 'Dominios',
                deployments: 'Despliegues',
                notifications: 'Notificaciones',
                users: 'Usuarios',
                settings: 'Ajustes'
            },
            home: {
                welcome: 'Bienvenido al Portal de Gestión de aeriOS',
                subtitle: 'Este es el Portal de Gestión, el único punto de entrada para gestionar el Meta-OS de aeriOS'
            },
            domains: {
                domainsList: 'Lista de dominios',
                description: 'Descripción',
                publicUrl: 'Url público',
                owner: 'Propietario',
                entrypoint: 'Punto de entrada',
                status: 'Estado',
                view: 'Ver',
                domainDetail: 'Detalle del dominio',
                infrastructureElements: 'Elementos de infraestructura',
                metrics: 'Métricas'
            },
            deployments: {
                deployedServices: 'Servicios desplegados',
                description: 'Descripción',
                name: 'Nombre',
                deployAsJob: 'Desplegar como trabajo',
                serviceOverlay: 'Superposición del servicio',
                actions: 'Acciones',
                newServiceDeployment: 'Nuevo despliegue de servicio',
                serviceDetail: 'Detalle del servicio',
                serviceComponents: 'Componentes del servicio',
                containerImage: 'Imagen del contenedor',
                status: 'Estado',
                newDeployment: 'Desplegar un nuevo servicio',
                deploymentName: 'Insertar nombre',
                numberOfComponents: 'Número de componentes',
                componentNumber: 'Componente número',
                service: 'Servicio',
                next: 'Siguiente',
                selectedIE: 'IE seleccionado',
                manual: 'Manual',
                semiAutomatic: 'Semiautomático',
                automatic: 'Automático',
                networkPorts: 'Puertos de red',
                cpuUsage: 'Uso de CPU',
                requiredRam: 'RAM requerida',
                cpuArch: 'Arquitectura de la CPU',
                summary: 'Resumen',
                component: 'Componente | Componentes',
                generalData: 'Datos generales',
                confirmDeploy: 'Confirmar y desplegar el servicio',
                deleteService: 'Eliminar servicio',
                exposed: '(expuesta)',
                notExposed: '(no expuesta)'
            },
            dataCatalog: {
                deleteDataProduct: 'Eliminar producto de datos',
                addDataProduct: 'Agregar producto de datos',
                owners: 'Propietarios',
                glossary: 'Términos del glosario',
                tags: 'Etiquetas',
                dataType: 'Tipo de datos',
                allDataType: 'Todos los tipos de datos',
                allGlossary: 'Todos los términos del glosario',
                allTags: 'Todas las etiquetas',
                allOwners: 'Todos los propietarios'
            },
            settings: {
                settings: 'Ajustes',
                generalSettings: 'Ajustes generales',
                systemSettings: 'Ajustes del sistema',
                darkMode: 'Modo oscuro',
                language: 'Idioma',
                fontSize: 'Tamaño de fuente',
                pushNotification: 'Notificaciones push',
                metrics: 'Visualización de métricas IE'
            },
            notifications: {
                type: 'Tipo',
                description: 'Descripción',
                date: 'Fecha',
                priority: 'Prioridad',
                deleteNotification: 'Eliminar notificación'
            },
            users: {
                newUser: 'Agregar un nuevo usuario',
                userData: 'Rellena el formulario con los datos requeridos',
                confirm: 'Confirmar y crear usuario',
                name: 'Nombre',
                role: 'Rol',
                status: 'Estado',
                allRoles: "Todos los roles",
                allStatus: "Todos los estados"
            },
            wip: {
                workInProgress: "Trabajo en progreso"
            }
        },
        fr: {
            general: {
                deleteConfirm: "Êtes-vous sûr de vouloir supprimer",
                stopConfirm: "Êtes-vous sûr de vouloir arrêter",
                startConfirm: "Êtes-vous sûr de vouloir démarrer ?",
                name: "Nom",
                accessDenied: "Accès refusé",
                contactAdmin: "Veuillez contacter l'administrateur système"
            },
            filter: {
                noResults: "Aucun résultat",
                results: "Résultats",
                clear: "Effacer"
            },
            sidebar: {
                home: 'Home',
                domains: 'Domaines',
                deployments: 'Déploiements',
                notifications: 'Notifications',
                users: 'Utilisateurs',
                settings: 'Paramètres'
            },
            home: {
                welcome: 'Bienvenue sur le Portail de Gestion de aeriOS',
                subtitle: 'Ceci est le Portail de Gestion, le point d’entrée unique pour gérer le Meta-OS de aeriOS'
            },
            domains: {
                domainsList: 'Liste des domaines',
                description: 'Description',
                publicUrl: 'Url public',
                owner: 'Propriétaire',
                entrypoint: 'Point d’entrée',
                status: 'Statut',
                view: 'Voir',
                domainDetail: 'Détail du domaine',
                infrastructureElements: "Éléments de l'infrastructure",
                metrics: 'Métriques'
            },
            deployments: {
                deployedServices: 'Services déployés',
                description: 'Description',
                name: 'Nom',
                deployAsJob: 'Déployer comme travail',
                serviceOverlay: 'Superposition du service',
                actions: 'Actions',
                newServiceDeployment: 'Nouveau déploiement de service',
                serviceDetail: 'Détail du service',
                serviceComponents: 'Composants du service',
                containerImage: 'Image du conteneur',
                status: 'Statut',
                newDeployment: 'Déployer un nouveau service',
                service: 'Service',
                deploymentName: 'Insérer le nom',
                numberOfComponents: 'Nombre de composants',
                componentNumber: 'Composant numéro',
                next: 'Suivant',
                selectedIE: 'IE sélectionné',
                manual: 'Manuel',
                semiAutomatic: 'Semi-automatique',
                automatic: 'Automatique',
                networkPorts: 'Ports réseau',
                cpuUsage: 'Utilisation CPU',
                requiredRam: 'RAM requise',
                cpuArch: 'Architecture de la CPU',
                summary: 'Résumé',
                component: 'Composant | Composants',
                generalData: 'Données générales',
                confirmDeploy: 'Confirmer et déployer le service',
                deleteService: 'Supprimer service',
                exposed: '(exposé)',
                notExposed: '(non exposé)'
            },
            dataCatalog: {
                deleteDataProduct: 'Supprimer le produit de données',
                addDataProduct: 'Ajouter un produit de données',
                owners: 'Propriétaires',
                glossary: 'Termes du glossaire',
                tags: 'Tags',
                dataType: 'Type de données',
                allDataType: 'Tous les types de données',
                allGlossary: 'Tous les termes du glossaire',
                allTags: 'Tous les tags',
                allOwners: 'Tous les propriétaires'
            },
            settings: {
                settings: 'Paramètres',
                generalSettings: 'Paramètres généraux',
                systemSettings: 'Paramètres du système',
                darkMode: 'Mode sombre',
                language: 'Langue',
                fontSize: 'Taille de la police',
                pushNotification: 'Notifications push',
                metrics: 'Affichage des métriques IE'
            },
            notifications: {
                type: 'Type',
                description: 'Description',
                date: 'Date',
                priority: 'Priorité',
                deleteNotification: 'Supprimer la notification'
            },
            users: {
                newUser: 'Ajouter un nouvel utilisateur',
                userData: 'Remplissez le formulaire avec les données requises',
                confirm: 'Confirmer et créer l’utilisateur',
                name: 'Nom',
                role: 'Rôle',
                status: 'Statut',
                allRoles: "Tous les rôles",
                allStatus: "Tous les statuts"
            },
            wip: {
                workInProgress: "Travail en cours"
            }
        }
    }
}))

export default i18n
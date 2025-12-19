<template>
  <div style="display: grid; align-self: start; width: calc(100vw - 200px);padding: 20px;">
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <h2>Continuum</h2>
    </div>
    <div style="height: calc(100vh - 146px)">
      <v-network-graph
          ref="graph"
          class="graph"
          :nodes="nodes"
          :edges="edges"
          :layouts="layouts"
          :configs="initialConfigs"
      >
<!--        <defs>-->
<!--          <component is="style">-->
<!--            @font-face { font-family: 'Material Icons'; font-style: normal; font-weight:-->
<!--            400; src:-->
<!--            url(https://fonts.gstatic.com/s/materialicons/v97/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2)-->
<!--            format('woff2'); }-->
<!--          </component>-->
<!--        </defs>-->
<!--        <template #override-node="{ nodeId, scale, config, ...slotProps }">-->
<!--          <circle :r="config.radius * scale" :fill="config.color" v-bind="slotProps" />-->
<!--          &lt;!&ndash; Use v-html to interpret escape sequences for icon characters. &ndash;&gt;-->
<!--          <text-->
<!--              font-family="Material Icons"-->
<!--              :font-size="22 * scale"-->
<!--              fill="#ffffff"-->
<!--              text-anchor="middle"-->
<!--              dominant-baseline="central"-->
<!--              style="pointer-events: none"-->
<!--              v-html="nodes[nodeId].icon"-->
<!--          />-->
<!--        </template>-->
        <template #edge-label="{ edge, ...slotProps }">
          <v-edge-label :text="edge.label" align="center" vertical-align="above" v-bind="slotProps" />
        </template>
      </v-network-graph>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, reactive, ref} from "vue";
import * as vNG from 'v-network-graph'
import { Nodes, Edges, Layouts } from "v-network-graph"
import {useDomainStore} from "@/stores/domain";
import dagre from "@dagrejs/dagre"
import {useDeploymentsStore} from "@/stores/deployment";

export default defineComponent({
  name: "ContinuumComponent",
  setup: () => {
    const domainsStore = useDomainStore()
    let nodes = reactive({} as Nodes)
    let edges = reactive({} as Edges)
    const layouts = reactive({
      nodes: {},
    } as Layouts)
    const graph = ref<vNG.Instance>()
    const fetchIE = (domainID: string) => {
      return new Promise((resolve, reject) => {
        domainsStore.fetchIE(domainID)
            .then(res => {
              res.data.map((ie: any) => {
                nodes[ie.id.split(':InfrastructureElement:')[1]] = {
                  name: `${ie.id.split(":InfrastructureElement:")[1]} \n Status: ${ie.infrastructureElementStatus.split(":InfrastructureElementStatus:")[1]}`,
                  color: "#4466cc"
                }
                edges[ie.id.split(":InfrastructureElement:")[1]] = {
                  source: domainID,
                  target: ie.id.split(":InfrastructureElement:")[1],
                  label: ie.internalIpAddress
                }
              })
            })
            .then(() => {
              resolve(true)
            })
      })
    }
    const fetchData = async () => {
      return new Promise((resolve, reject) => {
        domainsStore.fetchDomains()
            .then(res => {
              res.data.map((d: any) => {
                nodes[d.id.split(':Domain:')[1]] = {
                  name: `${d.id.split(':Domain:')[1]} \n Status: ${d.domainStatus.split(":DomainStatus:")[1]} \n${d.publicUrl}`,
                  color: "#8E9DCC"
                }
              })
              const generateNodesIE = Promise.all(
                  res.data.map((d: any) => {
                    return fetchIE(d.id.split(':Domain:')[1])
                  })
              )
              generateNodesIE
                  .then(() => resolve(true))
                  .catch(err => console.error(err))
            })
            .catch(err => {
              reject(err)
              console.error(err)
            })
      })
    }
    const nodeSize = 80
    const layout = async () => {
      await fetchData()
          .then(() => {
            // Automatic layout is out-of-scope from v-network-graph
            // i've used dagrejs (https://github.com/dagrejs/dagre/wiki) for this task
            // as suggested by the developers of v-network-graph
            const g = new dagre.graphlib.Graph()

            g.setGraph({
              rankdir: "LR",
              nodesep: nodeSize * 2,
              edgesep: nodeSize,
              ranksep: nodeSize * 2,
            })
            g.setDefaultEdgeLabel(() => ({}))

            Object.entries(nodes).forEach(([nodeId, node]) => {
              g.setNode(nodeId, { label: node.name, width: nodeSize, height: nodeSize })
            })

            // Add edges to the graph.
            Object.values(edges).forEach(edge => {
              g.setEdge(edge.source, edge.target)
            })

            dagre.layout(g)

            g.nodes().forEach((nodeId: string) => {
              // update node position
              const x = g.node(nodeId).x
              const y = g.node(nodeId).y
              layouts.nodes[nodeId] = { x, y }
            })
          })

    }
    const initialConfigs = vNG.defineConfigs({
      view: {
        autoPanAndZoomOnLoad: "center-content",
        minZoomLevel: 0.2,
        scalingObjects: true,
        onBeforeInitialDisplay: async () => await layout()
      },
      node: {
        selectable: true,
        draggable: false,
        normal: {
          type: "circle",
          radius: 16,
          // for type is "rect" -->
          width: 32,
          height: 32,
          borderRadius: 4,
          // <-- for type is "rect"
          strokeWidth: 0,
          strokeColor: "#000000",
          strokeDasharray: "0",
          color: node => node.color,
        },
        hover: {
          type: "circle",
          radius: 16,
          // for type is "rect" -->
          width: 32,
          height: 32,
          borderRadius: 4,
          // <-- for type is "rect"
          strokeWidth: 0,
          strokeColor: "#000000",
          strokeDasharray: "0",
          color: "#dd2288",
        },
        selected: {
          type: "circle",
          radius: 16,
          // for type is "rect" -->
          width: 32,
          height: 32,
          borderRadius: 4,
          // <-- for type is "rect"
          strokeWidth: 0,
          strokeColor: "#000000",
          strokeDasharray: "0",
          color: "#4466cc",
        },
        label: {
          visible: true,
          fontFamily: undefined,
          directionAutoAdjustment: true,
          fontSize: 11,
          lineHeight: 1.6,
          color: "#000000",
          margin: 4,
          direction: "south",
          background: {
            visible: false,
            color: "#ffffff",
            padding: {
              vertical: 1,
              horizontal: 4,
            },
            borderRadius: 2,
          },
        },
        focusring: {
          visible: true,
          width: 4,
          padding: 3,
          color: "#eebb00",
          dasharray: "0",
        },
      },
      edge: {
        selectable: true,
        normal: {
          width: 3,
          color: "#4466cc",
          linecap: "butt",
          dasharray: edge => (edge.animate ? "4" : "0"),
          animate: edge => !!edge.animate,
          animationSpeed: 50,
        },
        hover: {
          width: 4,
          color: "#3355bb",
          linecap: "butt",
          animate: true,
          animationSpeed: 50,
        },
        selected: {
          width: 3,
          color: "#dd8800",
          dasharray: "6",
          linecap: "round",
          animate: false,
          animationSpeed: 50,
        },
        gap: 3,
        type: "straight",
        summarize: true,
        summarized: {
          label: {
            fontSize: 10,
            color: "#4466cc",
          },
          shape: {
            type: "rect",
            radius: 6, // for type is "circle"
            width: 12,
            height: 12,
            borderRadius: 3,
            color: "#ffffff",
            strokeWidth: 1,
            strokeColor: "#4466cc",
            strokeDasharray: "0",
          },
          stroke: {
            width: 5,
            color: "#4466cc",
            dasharray: "0",
            linecap: "butt",
            animate: false,
            animationSpeed: 50,
          },
        },
      },
    })
    return {
      nodes,
      edges,
      layouts,
      initialConfigs,
      graph
    }
  }
})
</script>

<style scoped>

h2 {
  color: #004AAD;
}
</style>
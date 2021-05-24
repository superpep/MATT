<template>
  <div class="control-section q-pa-md">
    <q-fab round @click="cambiarEstado()" class="absolute-top-left" style="margin: 10px" color="primary" icon="arrow_back" :title="$t('return')" />
    <div  align='center'>
        <ejs-chart style="overflow-x: scroll;" :zoomSettings='zoom' height='100%' width='100%' enableScrollBar :theme='theme' align='center' id='chartcontainer' :title='title' :primaryXAxis='primaryXAxis'
         :primaryYAxis='primaryYAxis' :chartArea='chartArea' :tooltip='tooltip' :load='load'>
            <e-series-collection>
                <e-series :dataSource='lap1_times' type='Column' xName='x' yName='y' name='Marcha' width=2 :marker='marker'> </e-series>
                <e-series :dataSource='lap2_times' type='Column' xName='x' yName='y' name='Equilibrio' width=2 :marker='marker'> </e-series>
                <e-series :dataSource='lap3_times' type='Column' xName='x' yName='y' name='Doble tarea' width=2 :marker='marker'> </e-series>
                <e-series :dataSource='total_times' type='Column' xName='x' yName='y' name='Total' width=2 :marker='marker'> </e-series>
            </e-series-collection>
        </ejs-chart>
    </div>
</div>

</template>
<style scoped>

</style>
<script>
import Vue from 'vue'
import { ChartPlugin, ColumnSeries, Category, DataLabel, Tooltip, Legend, Zoom } from '@syncfusion/ej2-vue-charts'

Vue.use(ChartPlugin)

let selectedTheme = location.hash.split('/')[1]
selectedTheme = selectedTheme || 'Material'
const theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, 'Dark')

export default {
  props: {
    patient:
    {
      type: Object,
      default: null
    }
  },
  created () {
    let count = 1
    this.patient.lap_times.forEach(time => {
      this.lap1_times.push({
        x: 'Día ' + count,
        y: time.lap1
      })
      this.lap2_times.push({
        x: 'Día ' + count,
        y: time.lap2
      })
      this.lap3_times.push({
        x: 'Día ' + count,
        y: time.lap3
      })
      this.total_times.push({
        x: 'Día ' + count++,
        y: time.total
      })
    })
  },
  data () {
    return {
      theme: theme,
      lap1_times: [],
      lap2_times: [],
      lap3_times: [],
      total_times: [],
      zoom:
    {
      enableMouseWheelZooming: true,
      enablePinchZooming: true,
      enableSelectionZooming: true,
      mode: 'X'
    },

      // Initializing Primary X Axis
      primaryXAxis: {
        valueType: 'Category', interval: 1, majorGridLines: { width: 0 }
      },
      chartArea: { border: { width: 0 } },

      // Initializing Primary Y Axis
      primaryYAxis:
        {
          majorGridLines: { width: 0 },
          majorTickLines: { width: 0 },
          lineStyle: { width: 0 },
          labelStyle: { color: 'transparent' }
        },

      marker:
     {
       dataLabel:
           { visible: false, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } }

     },

      tooltip: {
        enable: true
      },

      title: 'Gráfico temporal - ' + this.patient.name
    }
  },
  provide: {
    chart: [ColumnSeries, Legend, DataLabel, Category, Tooltip, Zoom]
  },
  methods: {
    load: function (args) {
      let selectedTheme = location.hash.split('/')[1]
      selectedTheme = selectedTheme || 'Material'
      if (selectedTheme === 'highcontrast') {
        args.chart.series[0].marker.dataLabel.font.color = '#000000'
        args.chart.series[1].marker.dataLabel.font.color = '#000000'
        args.chart.series[2].marker.dataLabel.font.color = '#000000'
      }
    },
    cambiarEstado () {
      this.$emit('cambiar-estado')
    }
  }

}
</script>

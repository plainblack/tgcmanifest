<template>
    <div class="station-interface">
        <!-- Station Selection -->
        <div class="station-selection">
            <label for="station">Station:</label>
            <Select id="station" v-model="selectedStation" :options="stations" optionLabel="label" optionValue="name"
                placeholder="Select Station" @change="handleStationChange" />
        </div>


        <!-- Task List -->
        <div v-if="order" class="order-tasks">
            <Card>
                <template #title>
                    Tasks for Order #{{ order.props.orderNumber }}
                </template>
                <template #content>
                    {{selectedStation}}
                    <hr/>
                    {{ currentOrderItems }}
                    <hr/>
                
                    <TaskList :tasks="currentOrderTasks" @taskComplete="handleTaskComplete" />
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import TaskList from './TaskList.vue'

// Station definitions
const stations = [
    { name: 'printer', label: 'Printer' },
    { name: 'UV', label: 'UV Coater' },
    { name: 'mimaki', label: 'Mimaki' },
    { name: 'RDC', label: 'RDC' },
    { name: 'parts', label: 'Parts' },
    { name: 'verify', label: 'Verify' },
    { name: 'shrinkwrap', label: 'Shrink Wrap' }
]

const props = defineProps({
    order: { type: Object, required: true },
});

// Reactive state
const selectedStation = ref('')


const currentOrderItems = computed(() => {
    if (!props.order || !selectedStation.value) return []

    // Get tasks for current station from the order
    return props.order.props.manifest.execution_order
        ?.find(station => station.name === selectedStation.value)

    
});

// Computed property for filtered tasks
const currentOrderTasks = computed(() => {
    if (!props.order || !selectedStation.value) return []

    // Get tasks for current station from the order
    const stationTasks = props.order.props.manifest.execution_order
        ?.find(station => station.name === selectedStation.value)
        ?.order_items.flatMap(item => item.tasks) || []

    return stationTasks.map(task => ({
        ...task,
        completed: false // We'll need to sync this with Yjs later
    }))
});

// Load saved station from localStorage
onMounted(() => {
    const savedStation = localStorage.getItem('selectedStation')
    if (savedStation) {
        selectedStation.value = savedStation
    }
})

// Handle station change
const handleStationChange = () => {
    localStorage.setItem('selectedStation', selectedStation.value)
}

// Handle task completion
const handleTaskComplete = ({ task, index }) => {
    console.log('Task completed:', task, 'at index:', index)
    // TODO: write to db
}
</script>

<style scoped>

.station-selection,
.order-input {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.p-inputgroup {
    display: flex;
    gap: 0.5rem;
}
</style>
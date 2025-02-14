<template>
    <div class="station-interface">
        <!-- Station Selection -->
        <div class="station-selection">
            <label for="station">Station:</label>
            <Dropdown id="station" v-model="selectedStation" :options="stations" optionLabel="label" optionValue="name"
                placeholder="Select Station" @change="handleStationChange" />
        </div>

        <!-- Order Input -->
        <div class="order-input">
            <label for="orderNumber">Order Number:</label>
            <div class="p-inputgroup">
                <InputText id="orderNumber" v-model="orderNumber" placeholder="Enter or scan order number"
                    @keyup.enter="loadOrder" />
                <Button @click="loadOrder" :disabled="!orderNumber || !selectedStation">
                    Load Order
                </Button>
            </div>
        </div>

        <!-- Task List -->
        <div v-if="currentOrder" class="order-tasks">
            <Card>
                <template #title>
                    Tasks for Order #{{ orderNumber }}
                </template>
                <template #content>
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

// Reactive state
const selectedStation = ref('')
const orderNumber = ref('')
const currentOrder = ref(null)

// Computed property for filtered tasks
const currentOrderTasks = computed(() => {
    if (!currentOrder.value || !selectedStation.value) return []

    // Get tasks for current station from the order
    const stationTasks = currentOrder.value.execution_order
        ?.find(station => station.name === selectedStation.value)
        ?.order_items.flatMap(item => item.tasks) || []

    return stationTasks.map(task => ({
        ...task,
        completed: false // We'll need to sync this with Yjs later
    }))
});

const orders = useVingKind({
    listApi: `/api/${useRestVersion()}/orders`,
    createApi: `/api/${useRestVersion()}/orders`,
    query: { includeMeta: true, sortBy: 'orderNumber', sortOrder: 'asc'  },
});
await Promise.all([
   // orders.search(),
    orders.fetchPropsOptions(),
]);
onBeforeRouteLeave(() => orders.dispose());

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
    // Clear current order when station changes
    currentOrder.value = null
    orderNumber.value = ''
}

// Load order
const loadOrder = async () => {
    if (!orderNumber.value || !selectedStation.value) return

    try {
        // TODO: Replace with actual API call
        console.log(`Loading order ${orderNumber.value} for station ${selectedStation.value}`)

        // Simulated order loading - replace with actual API call
        currentOrder.value = {
            orderNumber: orderNumber.value,
            station: selectedStation.value,
            // Add mock execution_order data for testing
            execution_order: [
                {
                    name: selectedStation.value,
                    order_items: [
                        {
                            tasks: [
                                {
                                    message: "Sample task 1",
                                    params: { param1: "value1" }
                                },
                                {
                                    message: "Sample task 2",
                                    params: { param2: "value2" }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    } catch (error) {
        console.error('Error loading order:', error)
        // TODO: Add error handling UI
    }
}

// Handle task completion
const handleTaskComplete = ({ task, index }) => {
    console.log('Task completed:', task, 'at index:', index)
    // TODO: Sync task completion with Yjs
}
</script>

<style scoped>
.station-interface {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
}

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
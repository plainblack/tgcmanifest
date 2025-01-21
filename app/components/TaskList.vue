<template>
    <div class="task-list">
        <div v-for="(task, index) in tasks" :key="index" class="task-item">
            <Card>
                <template #content>
                    <div class="task-content">
                        <Checkbox :id="`task-${index}`" v-model="task.completed"
                            @change="handleTaskComplete(task, index)" :binary="true" />
                        <label :for="`task-${index}`" class="task-message">
                            {{ task.message }}
                        </label>
                    </div>
                    <div class="task-meta" v-if="task.params">
                        <Chip v-for="(value, key) in task.params" :key="key" :label="`${key}: ${value}`"
                            class="task-param" />
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    tasks: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['taskComplete'])

const handleTaskComplete = (task, index) => {
    emit('taskComplete', { task, index })
}
</script>

<style scoped>
.task-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.task-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.task-message {
    flex: 1;
    font-size: 1.1rem;
}

.task-meta {
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.task-param {
    margin-right: 0.5rem;
}
</style>
<template>
    <NuxtLink v-if="user" :to="user.links?.profile?.href">
        <UserAvatar :user="user" />
    </NuxtLink>
    <Message v-else severity="error">You may need to <i>includeRelated:['user']</i> to view this.</Message>
</template>

<script setup>
const props = defineProps({
    user: Object,
});
</script>
<template>
    <Title>Order #{{order.props?.orderNumber}}</Title>
    <PanelFrame :title="`Order #${order.props?.orderNumber}`" section="Orders">
       
        <template #content>
            <StationInterface />

            <PanelZone v-if="order.props?.id">
                
                    <div><b>Id</b>: {{order.props?.id}} <CopyToClipboard :text="order.props?.id" size="xs" /></div>
                    
            <div><b>Created At</b>: {{formatDateTime(order.props?.createdAt)}}</div>
            
            <div><b>Updated At</b>: {{formatDateTime(order.props?.updatedAt)}}</div>
            
            <div><b>Order Number</b>: {{order.props?.orderNumber}}</div>
            
            <div><b>Manifest</b>: {{order.props?.manifest}}</div>
            
            </PanelZone>
            <div v-if="order.meta?.isOwner">
                <NuxtLink :to="order.links?.edit?.href" class="no-underline mr-2 mb-2">
                    <Button severity="success" title="Edit" alt="Edit Order"><Icon name="ph:pencil" class="mr-1"/> Edit</Button>
                </NuxtLink>
                <Button @mousedown="order.delete()" severity="danger" title="Delete" alt="Delete Order"><Icon name="ph:trash" class="mr-1"/> Delete</Button>
            </div>
        </template>
    </PanelFrame>
</template>
  
<script setup>
const route = useRoute();
const id = route.params.id.toString();
const order = useVingRecord({
    id,
    fetchApi: `/api/${useRestVersion()}/orders/${id}`,
    query: { includeMeta: true, includeOptions: true  },
});
await order.fetch();
onBeforeRouteLeave(() => order.dispose());
</script>
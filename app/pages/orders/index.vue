<template>
    <Title>Orders</Title>
    <PanelFrame title="Orders">
        <template #content>
            <PanelZone >
                <InputGroup>
                    <InputGroupAddon>
                        <Icon name="ion:search" />
                    </InputGroupAddon>
                    <InputText type="text" placeholder="Orders" class="w-full"
                        v-model="orders.query._start_orderNumber" @keydown.enter="orders.search()" />
                    <Button label="Search" @mousedown="orders.search()" />
                </InputGroup>

                <DataTable :value="orders.records" stripedRows @sort="(e) => orders.sortDataTable(e)">
                    
        
            <Column field="props.orderNumber" header="Order Number" sortable>
                <template #body="slotProps">
                    <NuxtLink :to="slotProps.data.links?.view?.href">
                        {{ slotProps.data.props.orderNumber }}
                    </NuxtLink>
                </template>
            </Column>

            <Column field="props.updatedAt" header="Updated At" sortable>
                <template #body="slotProps">
                    {{ formatDateTime(slotProps.data.props.updatedAt) }}
                </template>
            </Column>
                    <Column header="Manage">
                        <template #body="slotProps">
                            <ManageButton severity="primary" :items="[
                                { icon:'ph:eye', label:'View', to:slotProps.data.links?.view?.href },
                             //   { icon:'ph:pencil', label:'Edit', to:slotProps.data.links?.edit?.href },
                              //  { icon:'ph:trash', label:'Delete', action:slotProps.data.delete}
                                ]" /> 
                        </template>
                    </Column>
                </DataTable>
                <Pager :kind="orders" />
            </PanelZone>
            
        </template>
    </PanelFrame>
</template>

<script setup>
const orders = useVingKind({
    listApi: `/api/${useRestVersion()}/orders`,
    createApi: `/api/${useRestVersion()}/orders`,
    query: { includeMeta: true, sortBy: 'createdAt', sortOrder: 'desc'  },
});
await Promise.all([
    orders.search(),
    orders.fetchPropsOptions(),
]);
onBeforeRouteLeave(() => orders.dispose());
</script>
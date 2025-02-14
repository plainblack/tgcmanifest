<template>
        <FormInput type="text" name="orderNumber" v-model="orders.query.orderNumber" placeholder="Order #" @keyup.enter="orders.search()" />
</template>

<script setup>

const orders = useVingKind({
    listApi: `/api/${useRestVersion()}/orders`,
    createApi: `/api/${useRestVersion()}/orders`,
    query: { includeMeta: true, sortBy: 'createdAt', sortOrder: 'desc'  },
    ego : 'orderSearch',
    onSearch: (props) => {
        if (props.items.length > 0) {
            orders.query.orderNumber = '';
            navigateTo(props.items[0].links.view.href);
        }
        else {
            useNotify().warn('Order not found');
        }
    }
});

</script>
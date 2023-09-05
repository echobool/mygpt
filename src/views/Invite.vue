<script lang="ts" setup>
import { useRoute } from 'vue-router';
import {  onMounted  } from 'vue';

const route = useRoute();
onMounted(() => {
    let id: string = route.params.id as string
    localStorage.setItem('invite_user_id', id)
   
    // 跳转到首页
    window.location.href='/'
   
});
</script>
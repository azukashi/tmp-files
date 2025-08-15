<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { computed } from 'vue';

const props = defineProps<{
    url: string;
    fileName: string;
    fileSize: unknown;
    fileType: string;
    expiredAt: string;
}>();

const expiredAfter = computed(() => {
    const minute = Math.floor((Number(new Date(props.expiredAt)) - Date.now()) / 60 / 1000);

    return `${minute} minute${minute > 1 ? 's' : ''}`;
});

function injectDownloadPath(originalUrl: string): string {
    try {
        const url = new URL(originalUrl);
        const pathSegments = url.pathname.split('/').filter((segment) => segment.length > 0);
        pathSegments.unshift('dl');
        url.pathname = '/' + pathSegments.join('/');

        return url.href;
    } catch (error) {
        console.error('Invalid URL provided:', originalUrl);
        return originalUrl;
    }
}
</script>

<template>
    <div class="bg-base-200 rounded-md w-full border-2 border-dotted border-gray-700">
        <div
            class="flex flex-row align-middle items-center justify-between gap-2 px-3 py-2 text-lg lg:text-base text-left font-medium text-ellipsis break-all truncate"
        >
            <div class="flex align-middle items-center gap-2 truncate">
                <div class="size-7">
                    <img
                        v-if="fileType === 'image/jpeg' || fileType === 'image/png'"
                        :src="injectDownloadPath(url)"
                        class="size-7"
                        alt="File preview"
                    />
                    <Icon v-else class="size-7" icon="mdi:file-outline" />
                </div>
                <div class="truncate">
                    <p class="truncate">{{ fileName }}</p>
                    <div class="flex gap-4">
                        <p class="text-clip text-xs hidden md:block">{{ fileType }}</p>
                        <p class="text-clip text-xs">{{ fileSize }}</p>
                        <p class="truncate text-xs"><span class="hidden md:inline">Exp. in</span> {{ expiredAfter }}</p>
                    </div>
                </div>
            </div>
            <div class="flex">
                <a class="btn btn-sm" :href="injectDownloadPath(url)" target="_blank">
                    <Icon class="size-4" icon="material-symbols:download" />
                </a>
                <a class="btn btn-sm" :href="url" target="_blank">
                    <Icon class="size-4" icon="majesticons:open-line" />
                </a>
            </div>
        </div>
    </div>
</template>

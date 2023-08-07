<script lang="ts" setup>
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
</script>

<template>
    <div class="collapse bg-base-200 rounded-md mt-4 w-full">
        <input type="checkbox" />
        <div class="collapse-title text-lg lg:text-base font-medium text-ellipsis break-all">
            {{ fileName }}
        </div>
        <div class="collapse-content text-left">
            <div class="overflow-x-auto">
                <table class="table">
                    <tbody>
                        <tr>
                            <th>File size</th>
                            <td>{{ fileSize }}</td>
                        </tr>
                        <tr>
                            <th class="text-ellipsis break-all">File type</th>
                            <td>{{ fileType }}</td>
                        </tr>
                        <tr>
                            <th>File URL</th>
                            <td>
                                <div class="tooltip" data-tip="or right click and copy">
                                    <a class="text-ellipsis break-all font-bold underline" :href="url" target="_blank"
                                        >Click to visit</a
                                    >
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>Expired after</th>
                            <td>{{ expiredAfter }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

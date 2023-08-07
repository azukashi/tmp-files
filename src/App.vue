<script setup lang="ts">
import { inject, onMounted, reactive, watch } from 'vue';
import { customAlphabet } from 'nanoid';
import { filesize } from 'filesize';
import type { VueCookies } from 'vue-cookies';
import vueFilePond from 'vue-filepond';

// @ts-ignore
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';
// @ts-ignore
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.esm.js';

import Title from './components/Title.vue';
import FileCard from './components/FileCard.vue';

const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginFileValidateSize);
const cookies = inject<VueCookies>('$cookies')!;
const nanoid = customAlphabet('0123456789abcdef', 8);
const files = reactive<
    {
        url: string;
        fileName: string;
        fileSize: unknown;
        fileType: string;
        expiredAt: string;
    }[]
>([]);

const processFile = (_: any, progress: any) => {
    const serverId: any = JSON.parse(progress.serverId);

    const expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() + 1);

    files.push({
        fileName: progress.filename,
        fileSize: filesize(progress.fileSize, { base: 10 }),
        fileType: progress.fileType,
        url: serverId.data.url,
        expiredAt: expiredAt.toISOString(),
    });
};

onMounted(() => {
    cookies.keys().forEach((key) => {
        if (!key.match(/^file\_[0-9a-f]+$/)) return;

        files.push(cookies.get(key));
    });

    watch(files, () => {
        const index = files.length - 1;
        const id = nanoid();

        cookies.set(`file_${id}`, files[index]);
    });
});
</script>

<template>
    <div>
        <Title />
        <div>
            <FilePond
                name="file"
                ref="pond"
                :credits="false"
                label-idle='Drag & Drop your files or <span class="filepond--label-action"> Browse </span>'
                :allow-multiple="true"
                :allow-browse="true"
                :allow-remove="true"
                :allow-revert="false"
                max-file-size="100MB"
                accepted-file-types="*"
                server="https://tmpfiles.org/api/v1/upload"
                :instant-upload="false"
                @processfile="processFile"
                class="mt-4"
            />
        </div>
        <div class="mt-4 font-fira_code">
            <FileCard v-if="files.length" v-for="file in files" v-bind="file" />
        </div>
    </div>
</template>

<style>
.filepond--root {
    font-family: 'Fira Code', monospace !important;
}
.filepond--panel-root {
    background-color: #242424 !important;
}
.filepond--drop-label {
    color: #ffffff !important;
}
</style>

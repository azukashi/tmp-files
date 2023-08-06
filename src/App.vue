<script setup lang="ts">
import { ref } from 'vue';
import { filesize } from 'filesize';
import vueFilePond from 'vue-filepond';
import Title from './components/Title.vue';
// @ts-ignore
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';
// @ts-ignore
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.esm.js';

const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginFileValidateSize);

let fileData = ref<any[]>([]);

const processFile = (file: any, progress: any) => {
    const serverId: any = JSON.parse(progress.serverId);
    const compose: any = {
        fileName: progress.filename,
        fileSize: filesize(progress.fileSize, { base: 10 }),
        fileType: progress.fileType,
        url: serverId.data.url,
        _file: file,
    };
    fileData.value.push(compose);
};
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
            <div class="collapse bg-base-200 rounded-md mt-4 w-full" v-if="fileData" v-for="file in fileData">
                <input type="checkbox" />
                <div class="collapse-title text-lg lg:text-base font-medium text-ellipsis break-all">
                    {{ file.fileName }}
                </div>
                <div class="collapse-content text-left">
                    <div class="overflow-x-auto">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th>File size</th>
                                    <td>{{ file.fileSize }}</td>
                                </tr>
                                <tr>
                                    <th class="text-ellipsis break-all">File type</th>
                                    <td>{{ file.fileType }}</td>
                                </tr>
                                <tr>
                                    <th>File URL</th>
                                    <td>
                                        <div class="tooltip" data-tip="or right click and copy">
                                            <a
                                                class="text-ellipsis break-all font-bold underline"
                                                :href="file.url"
                                                target="_blank"
                                                >Click to visit</a
                                            >
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Expiration</th>
                                    <td>1 hour</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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

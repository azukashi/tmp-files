<script setup lang="ts">
import { inject, onMounted, reactive, watch } from 'vue';
import { customAlphabet } from 'nanoid';
import { filesize } from 'filesize';
import type { VueCookies } from 'vue-cookies';
import vueFilePond from 'vue-filepond';
import Title from './components/Title.vue';
// @ts-ignore
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';
// @ts-ignore
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.esm.js';

const FilePond = vueFilePond(FilePondPluginImagePreview, FilePondPluginFileValidateSize);
const cookies = inject<VueCookies>('$cookies')!;
const files = reactive<any[]>([]);
const nanoid = customAlphabet('0123456789abcdef', 8);

const processFile = (file: any, progress: any) => {
    const serverId: any = JSON.parse(progress.serverId);

    const expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() + 1);

    const compose: any = {
        fileName: progress.filename,
        fileSize: filesize(progress.fileSize, { base: 10 }),
        fileType: progress.fileType,
        url: serverId.data.url,
        expiredAt,
        _file: file,
    };
    files.push(compose);
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
            <div class="collapse bg-base-200 rounded-md mt-4 w-full" v-if="files.length" v-for="file in files">
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
                                    <th>Expired after</th>
                                    <td>
                                        {{ Math.floor((Number(new Date(file.expiredAt)) - Date.now()) / 60 / 1000) }}
                                        minute(s)
                                    </td>
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

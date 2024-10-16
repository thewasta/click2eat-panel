'use client';

import {Card, CardBody} from '@nextui-org/card';
import {Button} from '@nextui-org/button';
import {useCallback, useRef, useState} from 'react';
import {twMerge} from 'tailwind-merge';

const isAllFiles = (dt: DataTransfer) =>
    dt.types.every(t => t === 'Files' || t === 'application/x-moz-file');
const doesAccept = (type: string, accept?: string) => {
    if (!accept) {
        return true;
    }

    const acceptList = accept.split(',').map(c => c.trim());
    let cond = false;
    for (const acceptor of acceptList) {
        if (acceptor.endsWith('*')) {
            cond ||= type.startsWith(acceptor.slice(0, -1));
        } else {
            cond ||= type === acceptor;
        }
    }
    return cond;
};
const isEventAllowed = <T extends HTMLElement>(
    e: React.DragEvent<T>,
    accept: string | undefined,
    multiple: boolean
) => {
    if (!isAllFiles(e.dataTransfer)) {
        return false;
    }

    const items = Array.from(e.dataTransfer.items);
    if (items.length === 0 || (!multiple && items.length > 1)) {
        return false;
    }
    return items.every(c => doesAccept(c.type, accept));
};

export default function FileUploadBox({
                                          accept,
                                          onUpload,
                                          multiple = false,
                                          className,
                                          ...props
                                      }: {
    className?: string;
    onUpload?: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
}) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [acceptance, setAcceptance] = useState<null | 'ACCEPT' | 'REJECT'>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const onDragEnter = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            if (isEventAllowed(e, accept, multiple)) {
                setAcceptance('ACCEPT');
            } else {
                setAcceptance('REJECT');
            }
        },
        [accept, multiple]
    );

    const onDragOver = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (isEventAllowed(e, accept, multiple)) {
                setAcceptance('ACCEPT');
            } else {
                setAcceptance('REJECT');
            }
        },
        [accept, multiple]
    );

    const onDragFinish = useCallback(() => {
        setAcceptance(null);
    }, []);

    const onDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            if (isEventAllowed(e, accept, multiple)) {
                const files = Array.from(e.dataTransfer.files);
                onUpload?.(files);

                const file = files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                }
            }
            setAcceptance(null);
        },
        [accept, multiple, onUpload]
    );

    const onFileChosen = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files!);
            onUpload?.(files);

            const file = files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        },
        [onUpload]
    );

    const onBoxClick = () => {
        inputRef.current?.click();
    };

    const onRemoveImage = () => {
        setPreview(null);
        inputRef.current!.value = '';
    };

    return (
        <>
            <div className="mb-4">
                <Card
                    isPressable
                    onClick={onBoxClick}
                    onDragEnter={onDragEnter}
                    onDragOver={onDragOver}
                    onDragLeave={onDragFinish}
                    onDrop={onDrop}
                    className={twMerge(
                        'cursor-pointer border-2 border-dashed rounded-lg p-4',
                        acceptance === 'ACCEPT'
                            ? 'border-green-500'
                            : acceptance === 'REJECT'
                                ? 'border-red-500'
                                : 'border-gray-300',
                        className
                    )}
                >
                    <CardBody className="flex flex-col items-center justify-center">
                        {preview ? (
                            <>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-h-40 object-cover mb-2"
                                />
                                <Button variant={"flat"} color={"danger"} onClick={onRemoveImage}>
                                    Borrar imagen
                                </Button>
                            </>
                        ) : (
                            <p className="text-center">Drag & drop or click to upload</p>
                        )}
                    </CardBody>
                </Card>
            </div>
            <input
                type="file"
                ref={inputRef}
                onChange={onFileChosen}
                accept={accept}
                multiple={multiple}
                className="hidden"
            />
        </>
    );
}

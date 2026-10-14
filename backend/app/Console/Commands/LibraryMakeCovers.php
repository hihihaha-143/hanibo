<?php

namespace App\Console\Commands;

use App\Models\LibraryItem;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;

class LibraryMakeCovers extends Command
{
    protected $signature = 'library:make-covers
                            {--force : Перегенерировать даже если cover уже существует}';

    protected $description = 'Генерирует превью (первую страницу PDF) для элементов библиотеки';

    public function handle(): int
    {
        $bin       = env('GHOSTSCRIPT_BIN', 'gswin64c');
        $publicDir = public_path('library');
        $coversDir = $publicDir . DIRECTORY_SEPARATOR . 'covers';

        if (!File::isDirectory($coversDir)) {
            File::makeDirectory($coversDir, 0755, true);
        }

        $items = LibraryItem::query()->get();
        $made  = 0;
        $skipped = 0;
        $failed  = 0;

        foreach ($items as $item) {
            if (!$item->file_path) {
                $this->warn("id={$item->id}: нет file_path, пропуск");
                $skipped++;
                continue;
            }

            $pdfPath = $publicDir . DIRECTORY_SEPARATOR
                . str_replace(['library/', '/'], ['', DIRECTORY_SEPARATOR], $item->file_path);

            if (!File::exists($pdfPath)) {
                $this->error("id={$item->id}: PDF не найден: {$pdfPath}");
                $failed++;
                continue;
            }

            $coverAbs = $coversDir . DIRECTORY_SEPARATOR . $item->id . '.jpg';
            $coverRel = 'library/covers/' . $item->id . '.jpg';

            if (!$this->option('force') && File::exists($coverAbs)) {
                $this->line("id={$item->id}: cover уже есть, пропуск");
                $skipped++;
                continue;
            }

            $process = new Process([
                $bin,
                '-sDEVICE=jpeg',
                '-dFirstPage=1',
                '-dLastPage=1',
                '-r100',
                '-dJPEGQ=85',
                '-o', $coverAbs,
                $pdfPath,
            ]);
            $process->setTimeout(60);
            $process->run();

            if (!$process->isSuccessful() || !File::exists($coverAbs)) {
                $this->error("id={$item->id}: Ghostscript упал: " . $process->getErrorOutput());
                $failed++;
                continue;
            }

            $item->cover_path = $coverRel;
            $item->save();

            $this->info("id={$item->id}: cover создан -> {$coverRel}");
            $made++;
        }

        $this->newLine();
        $this->info("Готово. Создано: {$made}, пропущено: {$skipped}, ошибок: {$failed}");

        return self::SUCCESS;
    }
}
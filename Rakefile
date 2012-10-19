task :build do
  require 'coffee-script'
  Dir['app/coffee/*.coffee'].each do |fn|
    fn2 = fn.sub(%r{app/coffee/}, 'public/javascripts/').sub(".coffee", ".js")
    puts "#{fn} -> #{fn2}"
    FileUtils.mkdir_p(File.dirname(fn2))
    File.open(fn2, 'w') do |f|
      f.write CoffeeScript.compile File.read(fn)
    end
  end
end

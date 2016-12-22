class AssetsManifest
  def self.manifest
    if Rails.env.production?
      @manifest ||= JSON.parse(File.read("assets.json"))
    end
  end

  def self.asset_path(url)
    if manifest
      manifest[url] || url
    else
      url
    end
  end
end

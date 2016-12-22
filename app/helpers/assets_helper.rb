module AssetsHelper
  def compute_asset_path(source, options={})
    source = AssetsManifest.asset_path(source)
    return File.join('/assets', source)
  end
end
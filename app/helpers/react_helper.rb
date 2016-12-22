module ReactHelper
  def react_component(name, props = {}, &block)
    content = block_given? ? capture(&block) : ''
    js = javascript_tag "document.addEventListener('DOMContentLoaded', function () {
                          ReactDOM.render(
                            React.createElement(
                              require('#{name}').default,
                              #{props.to_json}
                            ),
                            document.getElementById('react_component')
                          );
                        });"
    js + content_tag(:div, content, id: 'react_component')
  end
end
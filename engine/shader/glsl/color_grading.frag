#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba;
    
    highp float blue_left = floor(color.b * _COLORS);
    highp float blue_right = ceil(color.b * _COLORS);
    
    highp vec2 uv_left = vec2((blue_left + color.r) / _COLORS, color.g);
    highp vec2 uv_right = vec2((blue_right + color.r) / _COLORS, color.g);
    
    highp vec4 color_blue_left = texture(color_grading_lut_texture_sampler, uv_left);
    highp vec4 color_blue_right = texture(color_grading_lut_texture_sampler, uv_right);

    color = mix(color_blue_left, color_blue_right, fract(color.b * _COLORS));

    out_color = color;
}
